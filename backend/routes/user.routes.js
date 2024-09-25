import express from "express"
import {
    allBlogs,
    getPostById,
    newBlog,
    updateDetails,
    deletePost,
    login,
    signup
} from "../controllers/blog.controller.js"
import { upload } from "../middleware/multer.middleware.js"
const router = express.Router()

router.post('/login', login)
router.post('/signup', upload.single('avatar'), signup)

router.get('/all', allBlogs)
router.post('/create', newBlog)

router.route('/:blogId')
    .get(getPostById)
    .patch(updateDetails)
    .delete(deletePost)

export default router