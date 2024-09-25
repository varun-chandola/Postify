import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import { connectDb } from "./db/db.js"
import userRoutes from "./routes/user.routes.js"

dotenv.config({
    path:'./.env'
})
const PORT = process.env.PORT
const app = express()
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())



connectDb()
app.use('/api/v1/user', userRoutes)
app.listen(PORT, () => console.log(`server running on port ${PORT}`))