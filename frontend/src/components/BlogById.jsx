import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { BiSolidLike } from "react-icons/bi";
import { MdEdit } from "react-icons/md";
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from './Navbar';
import toast from "react-hot-toast"
import { AuthContext } from '../context/Context'


const BlogById = () => {
    const { authUser, setAuthUser } = useContext(AuthContext)
    const [blogOwner, setBLogOwner] = useState(null)
    const [blog, setBlog] = useState(null)
    const [blogLike, setBlogLikes] = useState(0)

    const navigate = useNavigate()

    console.log("authuser", authUser)
    console.log("blogowner", blogOwner)
    const { blogId } = useParams()
    const getBlogById = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/v1/user/${blogId}`, { withCredentials: true })
            console.log(response.data?.blog)
            setBlog(response?.data?.blog)
            setBlogLikes(response?.data?.blogLikes?.likes)
            setBLogOwner(response?.data?.blog?.owner?.username)
        } catch (error) {
            if ((error.response?.data?.msg).includes("unauthorized"))
                navigate('/login')
        }
    }

    const like = async () => {
        try {
            const response = await axios.post(`http://localhost:5000/api/v1/user/${blogId}`, {}, { withCredentials: true })
            console.log(response?.data)
            setBlogLikes(response?.data?.blogLikes?.likes)
            toast.success(response?.data?.msg)
        } catch (error) {
            console.log('error liking post');
            toast.error(error.response?.data?.msg)
        }
    }
    useEffect(() => {
        getBlogById()
    }, [])
    return (
        <>
            <Navbar />
            {blog ?
                <>
                    <div className='max-w-screen mt-10'>
                        <div className=' flex items-center justify-center'>
                            <img src={blog?.image} className='w-[60vw] rounded-3xl' />
                        </div>
                        <div className='flex items-center justify-center text-xl'>
                            <p className='mr-10 p-3 mt-5'>@{blog?.owner?.username}</p>
                            <p className='mr-10 p-3 mt-5'>Date created : {new Date(blog?.createdAt).toLocaleDateString()}
                            </p>
                            <BiSolidLike className='text-3xl mt-5 mr-2 hover:cursor-pointer' onClick={like} />
                            <p className='text-2xl mt-5'>{blogLike}</p>
                            {(authUser === blogOwner) ? <MdEdit className='text-3xl mt-5 mr-2 hover:cursor-pointer ml-10' onClick={() => navigate(`/${blog?._id}/update`)} /> : <></>}
                        </div>
                        <div className='flex items-center justify-center mt-10'>
                            <h1 className='text-3xl font-bold'>{blog.title}</h1>
                        </div>
                        <div className='bg-gray-100 w-[80vw] m-auto text-xl rounded-xl mt-10 p-5 text-left'>
                            {blog?.content}
                        </div>
                    </div>
                </> : <h1>Loading ...</h1>
            }
        </>
    )
}

export default BlogById