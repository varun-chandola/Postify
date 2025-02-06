import mongoose from "mongoose"

export const connectDb = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URL)
        console.log(`db connected to host ${connection.connection.host}`)
    } catch (error) {
        return "error connecting to the DB"
    }
}