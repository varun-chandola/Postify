import express from "express"
import {
    allBlogs,
    getPostById,
    newBlog,
    updateDetails,
    deletePost,
    userBlogs,
    likeBlog,
    userLikedBlogs,
    login,
    logout,
    signup,
} from "../controllers/user.controller.js"
import { upload } from "../middleware/multer.middleware.js"
import { authmiddleware } from "../middleware/auth.middleware.js"
const router = express.Router()

router.post('/login', login)
router.post('/signup', upload.single('avatar'), signup)
router.post('/logout', authmiddleware , logout )

router.get('/all', authmiddleware, allBlogs)
router.post('/create', authmiddleware, upload.single('blog-image'), newBlog)

router.get('/your-blogs', authmiddleware, userBlogs)

router.route('/:blogId')
    .get(authmiddleware, getPostById)
    .patch(authmiddleware, upload.single("image"), updateDetails)
    .delete(authmiddleware, deletePost)
    .post(authmiddleware, likeBlog)

router.get('/feed/yourLikedBlogs', authmiddleware, userLikedBlogs)
export default router