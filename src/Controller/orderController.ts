import { Request, Response} from "express";
import { PrismaClient } from "@prisma/client";{ }
import {v4 as uuidv4 } from "uuid";
import { request } from "http";
require('dotenv').config();

const prisma = new PrismaClient ({ errorFormat: "pretty"})
export const getAllOrders = async ( request: Request, response: Response) => {
    try {
        const {search} = request.query

        const allOrders = await prisma.transaksi.findMany({
            where: {
                OR: [
                    { Id: Number(search) || undefined },
                    { IdAlat: Number(search) || undefined }
                ]
            },
            orderBy : { createdAt   : "desc"},
            include: { detailTransaksi  : true }
        })
         return response.json ({
            status: true,
            data: allOrders,
            message: 'Order list has retrieved'
         }).status(200)
    } catch(error) {
        return response.json ({
            status: false,
            message : `ini error. ${error}`
        })
        .status (400)
    }
    
}

export const createOrder = async (request: Request, response: Response) => {
    try{
        const {customer, id, payment_method, statusBayar, detailTransaksi} = request.body
        const user = request.body.user
        const uuid = uuidv4()

        let totalPrice = 0
        for (let index = 0; index <  detailTransaksi.length; index++) {
            const {alat_id} = detailTransaksi [index]
            const detailAlat = await prisma.alat.findFirst ({
                where : {
                    id: alat_id
                }
            })
            if (!detailAlat) return response
            .status(200).json ({ status: false,
                message: ` Alat with id ${alat_id} is not found`
            })
            totalPrice += ( detailAlat.price * detailTransaksi [index].quantity)
        }
        const newOrder = await prisma.order.create ({
            data: {uuid, customer,id, totalPrice, payment_method,statusBayar, idUser: user.id}

        })
        for (let index = 0; index < detailTransaksi.length; index++) {
            const uuid = uuidv4()
            const { menuId, quantity, note } = detailTransaksi[index]
            await prisma.detailTransaksi.create({
                data: {
                    uuid, idOrder: newOrder.id, id: Number(id), 
                }
            })
        }
        return response.json({
            status: true,
            data: newOrder,
            message: `New Order has created`
        }).status(200)
    } catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error. ${error}`
            })
            .status(400)
    }
}
 
export const updateStatusOrder = async ( request : Request, response: Response) => {
    try{
        const {id} = request.params
        const { status} = request.body
        const user = request.body.user

        const findOrder = await prisma.order.findFirst({ where: { id:
            Number(id) } })
            if (!findOrder) return response
                .status(200)
                .json({ status: false, message: `Order is not found` })
     
     
            
            const updatedStatus = await prisma.order.update({
                data: {
                    statusBayar: status || findOrder.statusBayar,
                    idUser: user.id ? user.id : findOrder.idUser
                },
                where: { id: Number(id) }
            })
     
     
            return response.json({
                status: true,
                data: updatedStatus,
                message: `Order has updated`
            }).status(200)
        } catch (error) {
            return response
                .json({
                    status: false,
                    message: `There is an error. ${error}`
                })
                .status(400)
        }
     }
     

 export const deleteOrder = async (request: Request, response: Response) => {
    try {
       
        const { id } = request.params
 
 
        
        const findOrder = await prisma.order.findFirst({ where: { id: Number(id) } })
        if (!findOrder) return response
            .status(200)
            .json({ status: false, message: `Order is not found` })

 let deleteOrderList = await prisma.detailTransaksi.deleteMany({ where: { idOrder: Number(id) } })

 let deleteOrder = await prisma.order.delete({ where: { id: Number(id) } })


 return response.json({
     status: true,
     data: deleteOrder,
     message: `Order has deleted`
 }).status(200)
} catch (error) {
 return response
     .json({
         status: false,
         message: `There is an error. ${error}`
     })
     .status(400)
}
}
