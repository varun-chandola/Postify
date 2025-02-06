import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import { connectDb } from "./db/db.js"
import userRoutes from "./routes/user.routes.js"
import cors from "cors"

dotenv.config()
const PORT = process.env.PORT
const app = express()
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))
app.use(cookieParser())



connectDb()
app.use('/api/v1/user', userRoutes)
app.listen(PORT, () => console.log(`server running on port ${PORT}`))