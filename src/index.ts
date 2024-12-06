import express from 'express'
import cors from 'cors'
import MenuRoute from "./Routes/alatMenu"
import alat from './Routes/alatMenu'
import user from './Routes/userRoute'
import Order  from './Routes/order'

const PORT : number = 8000
const app = express () 
app.use(cors())

app.use('/alat',alat);
app.use('/user', user)
app.use('/order',Order)

app.listen (PORT,() => {
                console.log(`[server] : Server is running at http://localhost:${PORT}`)
})