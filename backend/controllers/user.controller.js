import { uploadOnCloudinary, deleteFromCloudinary } from "../cloudinary.js"
import jwt from "jsonwebtoken"
import { User } from "../model/user.model.js"

export const signup = async (req, res) => {
    try {
        const { username, password, email } = req.body
        const avatarLocalPath = req.file?.path
        const avatar = await uploadOnCloudinary(avatarLocalPath)

        if (!(username && password && email))
            return res.status(409).json({
                msg: "all fields are mandatory"
            })

        const emailTaken = await User.findOne({ email })

        if (emailTaken)
            return res.status(409).json({
                msg: "Email Taken"
            })

        const usernameTaken = await User.findOne({ username })
        if (usernameTaken)
            return res.status(409).json({
                msg: "Username Taken"
            })


        const newUser = await User.create({
            username,
            password,
            email,
            avatar: avatar.secure_url
        })

        return res.status(200).json({
            msg: "new user registered",
            newUser
        })
    } catch (error) {
        return res.status(500).json({
            message: "Error Signing Up",
            err: error.message
        })
    }
}

export const login = async (req, res) => {
    try {
        const { username, password } = req?.body
        console.log(username)
        console.log(password)
        if (!(username && password))
            return res.status(409).json({ msg: "Both Fields are mandatory" })

        const user = await User.findOne({ username })
        if (!user) return res.status(409).json({
            msg: "User does not exist"
        })

        if (!(await user.isPasswordCorrect(password)))
            return res.status(409).json({ msg: "Incorrect Password" })

        const token = jwt.sign({ _id: req?.user?._id, username }, process.env.jwt_secret)

        res.status(200).cookie('auth', token).json({
            msg: "login successfull",
            token
        })
    } catch (error) {
        return res.status(500).json({
            msg: "Error logging in",
            err: error.message
        })
    }
}




export const allBlogs = async (req, res) => {

}

export const getPostById = async (req, res) => {
}

export const newBlog = async (req, res) => {
}
export const updateDetails = async (req, res) => {
    try {
        return res.json({
            msg: "update details"
        })
    } catch (error) {

    }
}
export const deletePost = async (req, res) => {
    try {
        return res.json({
            msg: "update details"
        })
    } catch (error) {

    }
}
