
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import {BASE_URL} from "../global"
import fs from "fs"
import { request } from "http";


const prisma = new PrismaClient({ errorFormat: "pretty" })

export const getAllAlat = async (request: Request, response: Response) => {
    try {
        const { search } = request.query;

        // Main query
        const allAlat = await prisma.alat.findMany({
            where: { name: { contains: search?.toString() || "" } }
        });

        return response.json({
            status: true,
            data: allAlat,
            message: 'barang tidak tersedia'
        }).status(200)
    } catch (error) {
        return response.json({
            status: false,
            message: `there is an error: ${error}`
        })
        .status(400)
    }
}

export const createAlat = async (request: Request, response: Response) => {
    try {
        const {name, color, stock, price, merk} = request.body
        const uuid = uuidv4()

        //proses untuk menyimpan menu baru
        const newAlat = await prisma.alat.create({
         data: { uuid, name, color, price : Number(price), merk}
        })

        return  response.json({
            status: true,
            data: newAlat,
            message: 'NEW ALAT TERSEDIA'
        }).status(200)
    } catch (error) {
        return response.json({
            status: false,
            message: `there is an error: ${error}`
        })
        .status(400)
    }
}

export const updateAlat = async (request: Request, response: Response) => {
    try{
        const {id} = request.params 
        const {name, color, stock, price, merk}  = request.body
        
        const findAlat = await prisma.alat.findFirst ({where : { id: Number(id)}})
        if (!findAlat) return response
        .status(200)
        .json ({status: false, message: `Alat is not found`})

        const updateAlat = await prisma.alat.update({
            data: {
                name: name || findAlat.name,
                color: color || findAlat.color,
                stock : stock ? Number(stock) : findAlat.stock,
                price : price ? Number(price) : findAlat.price,
                merk: merk || findAlat.merk
            },
            where: {id: Number(id)}
        })
        return response.json({
            status: true,
            data: updateAlat,
            message: 'alat has updated'
        }).status(200)
    } catch (error) {
        return response.json({
            status: false,
            message: `there is an error: ${error}`
        })
        .status(400)
    }
}
 
export const changePicture = async (request: Request, response: Response) => {
    try{

        const {id } = request.params

        const findAlat = await prisma.alat.findFirst({ where: {id: Number(id)}})
        if(!findAlat) return response
        .status(200)
        .json({ status: false, message: ` Alat is not found`})

        let filename = findAlat.pict
        if (request.file) {
            filename = request.file.filename
            let path = `${BASE_URL}/../public/alat_picture/${findAlat.pict}`
            let exists = fs.existsSync(path)
            
            if (exists && findAlat.pict !== ``) fs.unlinkSync(path)
        }
    const updatePicture = await prisma.alat.update({
        data: {pict: filename},
        where: {id: Number(id)}
    })
    return response.json({
        status: true,
        data: updatePicture,
        message: 'Picture has updated'
    }).status(200)
} catch (error) {
    return response.json({
        status: false,
        message: `there is an error: ${error}`
    })
    .status(400)

    }
}

export const deleteAlat = async (request: Request, response:Response) => {
    try{
       
     const { id } = request.params

    //make sure that data is exist in  database
    const findMenu = await prisma.alat.findFirst ({ where : {id: Number(id) } })
    if (!findMenu) return response.status(200).json 
    ({status : false, message : 'alat is not found'})

    //process to delete menu's data.
    const deleteAlat = await prisma.alat.delete({
      where : {id : Number(id)}
    })
    return response.json({
      status: true,
      data:deleteAlat,
      message: 'alat has deleted'
    }).status(200)
  } catch (error) {
    return response.json ({
      status: false,
      message: `There is an error. ${error}`
    })
    .status(400)
  }
}


   