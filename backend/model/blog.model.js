import mongoose from "mongoose"
const blogSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    image: {
        type: String,
        default: "https://archive.org/download/placeholder-image/placeholder-image.jpg"
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    parentCollection: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Collection',
    },
    tags: [],
    likes: {
        type: Number,
        default: 0
    },
    draft: String
}, { strict: false, timestamps: true })
export const Blog = mongoose.model("Blog", blogSchema)