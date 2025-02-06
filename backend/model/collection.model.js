import mongoose, { mongo } from "mongoose"
const collectionSchema = new mongoose.Schema({
    collectionOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    collectionName: {
        type: String,
        required: true,
        default: "Solo",
        unique: true
    },
    collectionChildrens: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog"
    }]
}, { strict: false, timestamps: true })
export const userCollection = mongoose.model("Collection", collectionSchema)