import express from "express";
import { changePicture, createAlat, deleteAlat, getAllAlat, updateAlat } from "../Controller/AlatController";
import { verifyAddAlat, verifyEditAlat }from "../middlewares/verifyAlat";
import uploadFile from "../middlewares/alatUpload"

const alat = express ()
alat.use (express.json())

alat.get('/' ,getAllAlat)
alat.post('/', [verifyAddAlat], createAlat);
alat.put('/:id', updateAlat)
alat.put(`/pic/:id`, [uploadFile.single("picture")], changePicture)
alat.delete(`/:id`, deleteAlat)

export default alat;
