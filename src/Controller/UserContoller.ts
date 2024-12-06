import { Request, Response } from "express";
import { jenis_Kelamin, Prisma, PrismaClient } from "@prisma/client";
import { v4 as uuidv4} from "uuid";
import { BASE_URL, SECRET } from "../global";
import fs from "fs"
import md5 from "md5"
import { sign } from "jsonwebtoken"
import { request } from "http";

const prisma = new PrismaClient ({errorFormat: "pretty"})

export const getAllUser = async (request : Request, response: Response) => {
    try { 
        const { search } = request.query;
        const allUser = await prisma.user.findMany ({
            where: {name: { contains:search?.toString() || ""}},

        })
        return response.json({
            status: true,
            data: allUser,
            message: 'user has retrieved',
        })
        .status(200)
    } catch (error) {
        return response.json({
            status: false,
            message:`there is an error. ${error}`,

        })
        .status(400)
    }
}


import { Role } from "@prisma/client";

export const createUser = async (request: Request, response: Response) => {
    try {
        const { name, email, password, no_telp, alamat, Jenis_kelamin, role } = request.body;
        const uuid = uuidv4();

        // Validasi role dengan enum Prisma
        if (!Object.values(Role).includes(role)) {
            return response.status(400).json({
                status: false,
                message: `Invalid role. Expected one of: ${Object.values(Role).join(", ")}`,
            });
        }

        const newUser = await prisma.user.create({
            data: {
                uuid,
                name,
                email,
                password: md5(password), // Hash password
                no_telp,
                alamat,
                Jenis_kelamin,
                role,
            },
        });

        return response.status(200).json({
            status: true,
            data: newUser,
            message: "User has been created",
        });
    } catch (error) {
        return response.status(400).json({
            status: false,
            message: `Error: ${error}`,
        });
    }
};
    

export const updateUser = async (request: Request, response: Response) => {
    try {
        const { id } = request.params;
        const { name, email, password, no_telp, alamat, Jenis_kelamin, role } = request.body;

        const findUser = await prisma.user.findFirst({ where: { id: Number(id) } });
        if (!findUser)
            return response.status(200).json({
                status: false,
                message: 'User tidak ditemukan',
            });

        const updatedUser = await prisma.user.update({
            data: {
                name: name || findUser.name,
                email: email || findUser.email,
                password: password || findUser.password,
                no_telp: no_telp || findUser.no_telp,
                alamat: alamat || findUser.alamat,
                Jenis_kelamin: Jenis_kelamin || findUser.Jenis_kelamin,
                role: role || findUser.role,
            },
            where: { id: Number(id) },
        });

        return response.json({
            status: true,
            data: updatedUser,
            message: 'User telah diperbarui',
        }).status(200);
    } catch (error) {
        return response.json({
            status: false,
            message: `Error: ${error}`,
        }).status(400);
    }
};

export const changePicture = async (request: Request, response : Response) => {
    try {
        const {id } = request.params

        const findUser = await prisma.user.findFirst({ where : { id: Number (id) } })
        if (!findUser) return response.status(200).json ({ message: 'USER TIDAK ADA!', })

        let filename = findUser.profile_picture
        if (request.file ) {
            filename = request.file.filename 

            let path = `${BASE_URL}/../public/userPicture/${findUser.profile_picture}`
            let exist = fs.existsSync(path)

            if (exist && findUser.profile_picture !== ``) fs.unlinkSync(path) //menghapus foto lama jika ada
        }

        const updatePicture = await prisma.user.update({
            data: { profile_picture : filename},
            where: { id : Number (id)}
        })
        return response.json({
            status:'true',
            data: updatePicture,
            message: 'foto telah diganti'
        })
    } catch( error ) {
        return response.json ({
            status: false,
            error: `there is an error${ error }`
        }).status(400)
    }
}
export const deleteUser = async (request: Request, response: Response) => {
    try {
        const { id } = request.params;

        const findUser = await prisma.user.findFirst({ where: { id: Number(id) } });
        if (!findUser) {
            return response.status(200).json({
                status: false,
                message: "user tidak ditemukan"
            });
        } // Menutup blok `if` dengan benar

        const deleteUser = await prisma.user.delete({
            where: { id: Number(id) },
        });

        return response.status(200).json({
            status: true,
            data: deleteUser,
            message: "User telah dihapus",
        });
        
    } catch (error) {
        return response.status(400).json({
            status: false,
            message: `Terjadi error: ${error}`,
        });
    }
};



export const authentication = async (request : Request, response: Response) => {

    try{
        const { email, password } = request.body;

        const findUser = await prisma.user.findFirst ({
            where: {email, password : md5(password)}
        })
        if(!findUser)
            return response.status(200).json({
        status: false,
        logged: false,
        message : 'email or password id invalid'
    })

    let data = {
        id : findUser.id,
        name: findUser.name,
        email : findUser.email,
        role : findUser.role,
    }

    let playload = JSON.stringify(data) // menyiapkan data yang akan dijadikan token
    let token = sign(playload, SECRET || "token")//untuk menggenerete token

    return response
    .status(200)
    .json({
        status: true,
        logged: true,
        message: 'Login success',
        token
    })

    } catch (error) {
        return response.json({
            status: 'false',
            message: `error ${error}`
        })
        .status(400)

    }
}

