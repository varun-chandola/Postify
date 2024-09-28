import mongoose from "mongoose"
import { uploadOnCloudinary, deleteFromCloudinary } from "../cloudinary.js"
import jwt from "jsonwebtoken"
import { User } from "../model/user.model.js"
import { Blog } from "../model/blog.model.js"

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
        if (!(username && password))
            return res.status(409).json({ msg: "Both Fields are mandatory" })

        const user = await User.findOne({ username })
        if (!user) return res.status(409).json({
            msg: "User does not exist"
        })

        if (!(await user.isPasswordCorrect(password)))
            return res.status(409).json({ msg: "Incorrect Password" })

        const token = jwt.sign({ _id: user?._id, username }, process.env.jwt_secret)

        res
            .status(200)
            .cookie('token', token)
            .json({
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
    try {
        const allBlogs = await Blog.find({}).populate('owner', 'username , avatar')
        return res.status(200).json({
            msg: "All blogs",
            allBlogs,
        })
    } catch (error) {
        return res.status(500).json({
            msg: "Error Fetching all Blogs",
            err: error.message
        })
    }
}

export const getPostById = async (req, res) => {
    try {
        const { blogId } = req.params
        const blog = await Blog.findById(blogId).populate('owner', 'username avatar')

        return res.status(200).json({ blog })
    } catch (error) {
        return res.status(200).json({
            msg: "Error Fetching this blog",
            err: error.message
        })
    }
}

export const userBlogs = async (req, res) => {
    try {
        const yourBlogs = await User.findOne({
            _id: req.user._id,
        }).select('blogs avatar username').populate("blogs", "image title content tags likes")

        return res.json({
            yourBlogs
        })

    } catch (error) {
        return res.status(200).json({
            msg: "Error Fetching Your Blogs"
        })
    }
}

export const newBlog = async (req, res) => {
    const { title, content, tags } = req.body
    if (!title)
        return res.status(409).json({
            msg: "Title Is Required"
        })
    if (!content)
        return res.status(409).json({
            msg: "Content Is Required"
        })
    if (!tags)
        return res.status(409).json({
            msg: "Tags are Required"
        })

    const blogImageLocalPath = req.file?.path
    if (!blogImageLocalPath)
        return res.status(200).json({
            msg: "Blog Image Path Invalid"
        })

    const blogImage = await uploadOnCloudinary(blogImageLocalPath)

    const blog = await Blog.create({
        owner: req.user?._id,
        image: blogImage.secure_url,
        title,
        content,
        tags: Array(tags),
        image_resource_type: blogImage.resource_type,
        image_public_id: blogImage.public_id,
        // image_type: blogImage.type,
    })

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $push: {
                blogs: blog._id
            }
        }
    )

    const blogInfo = await Blog.findById(blog._id).select("owner image title content tags").populate("owner", "username avatar")

    return res.status(200).json({
        msg: "Blog created successfully",
        blogInfo
    })
}

export const updateDetails = async (req, res) => {
    try {
        const { blogId } = req.params
        const { title, content, tags } = req.body
        const updatedInfo = {}
        // const originalBlog = await Blog.findById(blogId)
        const currentImage = await Blog.findOne({
            _id: blogId,
            owner: req.user._id
        }).select("image_resource_type image_public_id")

        if (title) updatedInfo.title = title
        if (content) updatedInfo.content = content
        if (tags) updatedInfo.tags = Array(tags)


        const newImagePath = req.file?.path
        if (newImagePath) {
            await deleteFromCloudinary(currentImage.image_public_id, currentImage.image_resource_type)
            const newImageInfo = await uploadOnCloudinary(newImagePath)
            updatedInfo.image = newImageInfo.secure_url

            const updatedBlogInfo = await Blog.findOneAndUpdate({
                _id: blogId,
                owner: req.user._id
            }, { $set: updatedInfo }, { new: true })

            return res.json({
                msg: "update details",
                // originalBlog,
                updatedBlogInfo
            })
        }

    } catch (error) {
        return res.status(500).json({
            msg: "Error Updating Details",
            err: error.message
        })
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

export const likeBlog = async (req, res) => {
    try {
        const { blogId } = req.params
        const isLiked = await User.findOne({
            _id: req.user?._id,
            likedBlogs: blogId
        })

        if (isLiked === null) {
            await User.findByIdAndUpdate(req.user?._id, {
                $push: {
                    likedBlogs: blogId
                }
            })
            await Blog.findByIdAndUpdate(blogId, {
                $inc: {
                    likes: 1
                }
            })

            const userlikes = await User.findById(req.user?._id).select('likedBlogs')
            return res.json({
                msg: "liked",
                userlikes
            })
        } else {
            await User.findByIdAndUpdate(req.user?._id, {
                $pull: {
                    likedBlogs: blogId
                }
            })
            await Blog.findByIdAndUpdate(blogId, {
                $inc: {
                    likes: -1
                }
            })
            const userlikes = await User.findById(req.user?._id).select('likedBlogs')

            return res.status(200).json({
                msg: "removed like",
                userlikes
            })
        }
    } catch (error) {
        return res.status(500).json({
            msg: "error in liking the blog",
            err: error.message
        })
    }
}

export const userLikedBlogs = async (req, res) => {
    try {
        const userLikedBlogs = await User.findById(req.user?._id).populate('likedBlogs').select("likedBlogs")
        return res.status(200).json({
            msg: "your liked posts",
            userLikedBlogs
        })
    } catch (error) {
        return res.status(500).json({
            msg: "Error getting your liked blogs"
        })
    }

}

export const logout = async (req, res) => {
    try {
        const token = req.cookies?.token
        return res
            .status(200)
            .clearCookie("token", token)
            .json({
                msg: "Logged Out"
            }).status(200)
    } catch (error) {
        return res.status(500).json({
            msg: "Error logging out",
            err: error.message
        })
    }
}