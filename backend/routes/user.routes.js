import express from "express"
import {
    allBlogs,
    getPostById,
    newBlog,
    updateDetails,
    deletePost,
    likeBlog,
    userLikedBlogs,
    login,
    logout,
    signup,
    formtest,
    userProfile,
    userCollections,
    createCollection,
    getAllBlogsInACollection,
    createDraft
} from "../controllers/user.controller.js"
import { upload } from "../middleware/multer.middleware.js"
import { authmiddleware } from "../middleware/auth.middleware.js"
const router = express.Router()

router.post('/login', login)
router.post('/signup', upload.single('avatar'), signup)
router.post('/logout', authmiddleware, logout)

router.get('/blogs/all', authmiddleware, allBlogs)
router.post('/blog/create', authmiddleware, upload.single('blog-image'), newBlog)
router.post('/blog/draft', authmiddleware, createDraft)

router.get('/feed/profile', authmiddleware, userProfile)

router.route('/:blogId')
    .get(authmiddleware, getPostById)
    .patch(authmiddleware, updateDetails)
    .delete(authmiddleware, deletePost)
    .post(authmiddleware, likeBlog)

router.get('/feed/yourLikedBlogs', authmiddleware, userLikedBlogs)
router.get('/feed/yourCollections', authmiddleware, userCollections)
router.post('/feed/create-collection', authmiddleware, createCollection)
router.get('/:collectionName/blogs', authmiddleware, getAllBlogsInACollection)

router.post('/form/test', authmiddleware, upload.single('blog-image'), formtest)
export default router