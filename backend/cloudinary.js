import { v2 as cloudinary } from "cloudinary"
import fs from "fs"


const uploadOnCloudinary = async (filepath) => {
    cloudinary.config({
        cloud_name: process.env.cloud_name,
        api_key: process.env.api_key,
        api_secret: process.env.api_secret
    });

    if (!filepath) {
        fs.unlink(filepath , ()=>{})
        return null
    }

    const response = await cloudinary.uploader.upload(filepath, { resource_type: "image" })
    const information = {
        secure_url: response.secure_url,
        resource_type: response.resource_type,
        public_id: response.public_id,
        type: response.type
    }
    fs.unlink(filepath , ()=>{}) 
    return information
}

const deleteFromCloudinary = async (public_id, resource_type) => {
    await cloudinary.uploader.destroy(public_id, { resource_type, invalidate: true })
}

export {
    uploadOnCloudinary,
    deleteFromCloudinary
}