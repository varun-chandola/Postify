import mongoose from "mongoose"
const blogSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    image: {
        type: String
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    tags: [],
    likes: {
        type: Number,
        default: 0
    }
}, { strict: false, timestamps: true })
export const Blog = mongoose.model("Blog", blogSchema)