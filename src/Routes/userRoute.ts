
import express from "express";
import { getAllUser, createUser,deleteUser,changePicture,  authentication,updateUser } from "../Controller/UserContoller"
import { verifyAddUser, verifyEditUser, verifyAuthentication } from "../middlewares/verifyUser"
import{ verifyRole, verifyToken} from "../middlewares/authorization"
import uploadProfile  from "../middlewares/profileUpload";

const app = express();
app.use(express.json());

app.get(`/`, getAllUser);
app.post(`/`, createUser);
app.put(`/:id`, [verifyToken, verifyRole(['KARYAWAN']), verifyEditUser], updateUser);
app.put(`/pic/:id`, [verifyToken, verifyRole(['KARYAWAN']), uploadProfile.single("picture")], changePicture);
app.post('/login', [verifyAuthentication], authentication)
app.delete(`/:id`,[verifyToken, verifyRole(['KARYAWAN'])], deleteUser);

export default app
