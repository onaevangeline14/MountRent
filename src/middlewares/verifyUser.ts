import { NextFunction, Request, response, Response } from "express";
import Joi from 'joi'
import { realpath } from "fs";
import { jenis_Kelamin } from "@prisma/client";
import { request } from "https";


//membuat data schema menambah data menu
const addDataSchema = Joi.object ({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    no_telp: Joi.string().min(10).required(),
    alamat: Joi.string().required(),
    jenis_kelamin: Joi.string().valid('P', 'L').required(),
    role: Joi.string().valid('KARYAWAN', 'CUSTOMER').required(),
    picture: Joi.allow().optional(),
});

    const editDataSchema = Joi.object({
        name  :  Joi.string().required(),
        email :  Joi.string().email().required(),
        password  : Joi.string().min(8).required(),
        no_telp : Joi.string().min(10).required(),
        alamat : Joi.string().required(),
        jenis_Kelamin : Joi.string().valid ('P', 'L').required(),
        role  :  Joi.string().valid('KARYAWAN', 'CUSTOMER').required(),
         picture : Joi.allow().optional()
        })

        const authSchema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(3).alphanum().required(),
        });
        
    
    export const verifyAuthentication =(
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        const { error } = authSchema.validate (request.body, { abortEarly : false })
    
    if (error) { 
        return response.status(400).json({
            status: false,
            message: error.details.map (it => it.message).join(),
        })
    }
    return next()
    }

    export const verifyAddUser = (req: Request, response: Response, next: NextFunction) => {
    //memvalidasi request body dan mengambul error
    const { error } = addDataSchema.validate(req.body, { abortEarly : false })
    
    if (error) { 
        return response.status(400).json({
            status: false,
            message: error.details.map (it => it.message).join()
        })
    }
    return next()

}

export const verifyEditUser = (req: Request, response: Response, next: NextFunction) => {
const { error } = editDataSchema.validate(req.body, { abortEarly: false })

if (error) {
    return response.status(400).json({
        status: false,
        message: error.details.map(it => it.message).join()
    })
}
return next()
}