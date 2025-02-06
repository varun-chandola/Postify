import { uploadOnCloudinary, deleteFromCloudinary } from "../cloudinary.js"
import jwt from "jsonwebtoken"
import { User } from "../model/user.model.js"
import { Blog } from "../model/blog.model.js"
import { userCollection } from "../model/collection.model.js"

export const signup = async (req, res) => {
    try {
        const { username, password, email } = req.body
        const avatarLocalPath = req.file?.path
        let avatar = ''
        if (avatarLocalPath) {
            avatar = await uploadOnCloudinary(avatarLocalPath)
        }

        if (!username || !password || !email)
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

        const token = jwt.sign({
            id: newUser?._id,
            username
        }, process.env.jwt_secret)

        return res.status(200).cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'None',
        }).json({
            msg: "User Registration Successful",
            token
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
        const { username, password } = req.body
        if (!username || !password)
            return res.status(409).json({ msg: "Both Fields are mandatory" })

        const user = await User.findOne({ username })
        if (!user) return res.status(409).json({
            msg: "User does not exist"
        })

        if (!(await user.isPasswordCorrect(password)))
            return res.status(409).json({ msg: "Incorrect Password" })

        const token = jwt.sign({
            id: user?._id,
            username
        }, process.env.jwt_secret)

        res.status(200).cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'None',
        }).json({
            msg: "Login successful",
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
        const allBlogs = await Blog.find({}).sort({
            createdAt: -1
        }).select('-createdAt -updatedAt').populate('owner', "avatar  username").select('-parentCollection')
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
        const blog = await Blog.findById(blogId).populate('owner', 'username avatar').populate('parentCollection', 'collectionName')

        return res.status(200).json({
            blog,
        })
    } catch (error) {
        return res.status(404).json({
            msg: "Error Fetching this blog",
            err: error.message
        })
    }
}

export const userProfile = async (req, res) => {
    try {
        const userProfile = await Blog.find({
            owner: req?.user?.id
        }).populate('parentCollection', 'collectionName')

        return res.json({
            userProfile
        })

    } catch (error) {
        return res.status(200).json({
            msg: "Error Fetching Your Blogs"
        })
    }
}

export const createCollection = async (req, res) => {
    try {
        const { collection } = req.body
        console.log('collection', collection)
        const nameTaken = await userCollection.findOne({
            collectionOwner: req.user?.id,
            collectionName: collection
        })

        if (nameTaken)
            return res.status(409).json({
                msg: "Collection Already Exists"
            })

        await userCollection.create({
            collectionOwner: req?.user?.id,
            collectionName: collection
        })

        return res.status(200).json({
            msg: "collection created"
        })
    } catch (error) {
        return res.status(500).json({
            msg: "error creating collection",
            err: error
        })
    }
}

export const getAllBlogsInACollection = async (req, res) => {
    try {
        const { collectionName } = req.params

        const allBlogsInThisCollection = await userCollection.findOne({
            collectionName: collectionName
        }).populate('collectionChildrens')

        if (!allBlogsInThisCollection) {
            return res.status(409).json({
                msg: "Collection Does Not exist"
            })
        }

        return res.status(200).json({
            msg: "All Blogs in this Collection",
            allBlogsInThisCollection
        })
    } catch (error) {
        return res.status(500).json({
            msg: "error getting blogs in this collection"
        })
    }
}

export const newBlog = async (req, res) => {
    let { title, content, tags, collection } = req.body
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
    let blogImage = ''
    if (blogImageLocalPath) {
        blogImage = await uploadOnCloudinary(blogImageLocalPath)
    }

    if (collection === "") {
        const soloCollection = await userCollection.findOne({
            collectionName: "Solo"
        })

        if (!soloCollection) {
            await userCollection.create({
                collectionName: "Solo",
                collectionOwner: req.user?.id
            })
        }

        const blog = await Blog.create({
            owner: req.user?.id,
            image: blogImage.secure_url,
            title,
            content,
            tags: Array(tags),
            image_resource_type: blogImage.resource_type,
            image_public_id: blogImage.public_id,
            parentCollection: soloCollection?._id
        })

        userCollection.findOneAndUpdate({
            collectionName: "Solo"
        }, {
            $push: {
                collectionChildrens: blog?._id
            }
        })

        return res.status(200).json({
            msg: "Blog created successfully"
        })

    } else {
        const availableCollection = await userCollection.findOne({
            collectionOwner: req?.user?.id,
            collectionName: collection
        })

        const blog = await Blog.create({
            owner: req.user?.id,
            image: blogImage.secure_url,
            title,
            content,
            tags: Array(tags),
            image_resource_type: blogImage.resource_type,
            image_public_id: blogImage.public_id,
            parentCollection: availableCollection?._id
        })

        await userCollection.findOneAndUpdate({
            collectionOwner: req?.user?.id,
            collectionName: collection,
        }, {
            $push: {
                collectionChildrens: blog?._id
            }
        })
    }

    return res.status(200).json({
        msg: "Blog created successfully"
    })
}

export const createDraft = async (req, res) => {
    const { title, tags, content, collection } = req.body
    if (!title) {
        return res.status(403).json({
            msg: "Title is required"
        })
    }

    if (!collection) {
        return res.status(403).json({
            msg: "collection is required"
        })
    }

    const foundCollection = await userCollection.findOne({
        collectionOwner: req.user?.id,
        collectionName: collection
    })

    const draft = await Blog.create({
        owner: req.user?.id,
        title,
        content,
        tags: Array(tags),
        image_resource_type: blogImage.resource_type,
        image_public_id: blogImage.public_id,
        parentCollection: foundCollection?._id,
    })

    return res.status(200).json({
        msg: "Saved In Draft",
        draft
    })
}

export const updateDetails = async (req, res) => {
    try {
        const { blogId } = req.params
        let { title, content, tags, collection, previousCollection } = req.body
        let updatedInfo = {}

        if (title !== undefined && title !== "") updatedInfo.title = title
        if (content !== undefined && content !== "") updatedInfo.content = content
        if (tags !== undefined && tags !== "") updatedInfo.tags = Array.isArray(tags) ? tags : [tags]

        let newCollection
        if (previousCollection === collection)
            newCollection = previousCollection

        if (previousCollection !== collection) {
            updatedInfo.collection = collection
            await userCollection.findOneAndUpdate({
                collectionName: previousCollection
            }, {
                $pull: {
                    collectionChildrens: blogId
                }
            })

            newCollection = await userCollection.findOneAndUpdate({
                collectionName: collection
            }, {
                $push: {
                    collectionChildrens: blogId
                }
            })

            await Blog.findOneAndUpdate({
                _id: blogId
            }, {
                parentCollection: newCollection?._id
            })
        }

        const updatedBlogInfo = await Blog.findOneAndUpdate({
            _id: blogId
        }, { $set: updatedInfo }, { new: true })


        return res.status(200).json({
            msg: "updates successful",
            updatedBlogInfo
        })
    }
    catch (error) {
        return res.status(500).json({
            msg: "Error Updating Details",
            err: error.message
        })
    }
}

export const deletePost = async (req, res) => {
    try {
        const { blogId } = req.params
        const blogImage = await Blog.findOne({
            _id: blogId,
            owner: req.user._id
        }).select("image_public_id image_resource_type")

        if (blogImage) {
            deleteFromCloudinary(blogImage.image_public_id, blogImage.image_resource_type)
        }

        await userCollection.findOneAndDelete({
            collectionChildrens: blogId
        })

        const userHasThePostInHisLikes = await User.findOne({
            likedBlogs: blogId
        })

        if (userHasThePostInHisLikes) {
            await User.findByIdAndUpdate(req.user?.id, {
                $pull: {
                    likedBlogs: blogId
                }
            })
        }

        await Blog.findByIdAndDelete(blogId)

        return res.status(200).json({
            msg: "Deleted"
        })
    } catch (error) {
        return res.status(500).json({
            err: error.message
        })
    }
}

export const likeBlog = async (req, res) => {
    try {
        const { blogId } = req.params
        const isLiked = await User.findOne({
            _id: req.user?.id,
            likedBlogs: blogId
        })

        if (isLiked === null) {
            await Blog.findByIdAndUpdate(blogId, {
                $inc: {
                    likes: 1
                }
            })

            await User.findByIdAndUpdate(req.user?.id, {
                $push: {
                    likedBlogs: blogId
                }
            })

            const blogLikes = await Blog.findById(blogId).select('likes')
            return res.json({
                msg: "liked",
                blogLikes,
                liked: true
            })
        } else {
            await User.findByIdAndUpdate(req.user?.id, {
                $pull: {
                    likedBlogs: blogId
                }
            })

            await Blog.findByIdAndUpdate(blogId, {
                $inc: {
                    likes: -1
                }
            })

            const blogLikes = await Blog.findById(blogId).select('likes')

            return res.status(200).json({
                msg: "removed like",
                blogLikes,
                liked: false
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
        const blogs = await User.findById(req?.user?.id).populate({
            path: 'likedBlogs',
            populate: {
                path: 'owner',
                select: 'username'
            }
        }).select('-password -email')
        return res.status(200).json({
            msg: "your liked posts",
            blogs
        })
    } catch (error) {
        return res.status(500).json({
            msg: "Error getting your liked blogs"
        })
    }

}

export const userCollections = async (req, res) => {
    try {
        const userCollections = await userCollection.find({
            collectionOwner: req.user?.id,
        }).select('collectionName')

        return res.status(200).json({
            msg: "user collections",
            userCollections
        })
    } catch (error) {
        return res.status(500).json({
            msg: "error getting user's collections"
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

export const formtest = async (req, res) => {
    try {
        const { title, content, tags } = req.body
        console.log('title , content , tags', title, content, tags)
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

        return res.status(200).json({
            title,
            content,
            tags: Array(tags),
            image: blogImageLocalPath
        })
    } catch (error) {
        return res.status(500).json({
            msg: "Error in form data check",
            err: error.message
        })
    }
}