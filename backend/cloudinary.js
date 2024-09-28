import { v2 as cloudinary } from "cloudinary"
import fs from "fs"
import dotenv from "dotenv"
dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const uploadOnCloudinary = async (filepath) => {
    try {
        if (!filepath) return null
        const response = await cloudinary.uploader.upload(filepath, { resource_type: "image" })
        fs.unlink(filepath, () => { })
        const information = {
            secure_url: response.secure_url,
            resource_type: response.resource_type,
            public_id: response.public_id,
            type: response.type
        }
        return information
    } catch (error) {
        fs.unlink(filepath)
        return error.message
    }
}

const deleteFromCloudinary = async (public_id, resource_type) => {
    try {
        if (!public_id) return null
        await cloudinary.uploader.destroy(public_id, { resource_type, invalidate: true })
    } catch (error) {
        return error.message
    }
}

export {
    uploadOnCloudinary,
    deleteFromCloudinary
}