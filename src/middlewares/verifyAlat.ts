import { NextFunction, Request, Response } from "express";
import { request } from "http";
import Joi, { optional } from "joi";
import { setUncaughtExceptionCaptureCallback } from "process";

const addDataSchema = Joi.object({
    name: Joi.string().optional(),
    color: Joi.string().optional(),
    stock: Joi.number().min(0).optional(),
    price: Joi.number().min(0).optional(),
    merk: Joi.string().optional(),

})

const editDataSchema = Joi.object({
    name: Joi.string().optional(),
    color: Joi.string().optional(),
    stock: Joi.number().min(0).optional(),
    price: Joi.number().min(0).optional(),
    merk: Joi.string().optional(),
})

export const verifyAddAlat = (request: Request, response: Response , next: NextFunction) => {
    const { error } = addDataSchema.validate(request.body, { abortEarly : false})

    if (error) {
        return response.status(400).json({
           
                    status: false,
                    message: error.details.map (it => it.message).join()
                })
            } 
            return next()
        }
        export const verifyEditAlat = (request: Request, response: Response , next: NextFunction) => {
            const { error } = addDataSchema.validate(request.body, { abortEarly : false})
        
            if (error) {
                return response.status(400).json({
                   
                            status: false,
                            message: error.details.map (it => it.message).join()
                        })
                    } 
                    return next()
                }
              
