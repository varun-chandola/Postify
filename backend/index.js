import express from "express"
import dotenv from "dotenv"
import userRoutes from "./routes/user.routes.js"
dotenv.config()
const PORT = process.env.PORT
const app = express()


app.use('/api/v1/user' , userRoutes)
app.listen(PORT, () => console.log(`server running on port ${PORT}`))