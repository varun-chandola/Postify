import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Navbar from './Navbar';
import toast from "react-hot-toast"
import he from "he"
import Skeleton from './Skeleton';

const BlogById = () => {
    const [blogLikes, setBlogLikes] = useState(0)
    const [blog, setBlog] = useState(null)
    const [liked, setLiked] = useState(false)
    const [loading, setLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)

    const navigate = useNavigate()
    const { blogId } = useParams()
    const getBlogById = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/v1/user/${blogId}`, { withCredentials: true })
            setBlog(response?.data?.blog)
            setBlogLikes(response.data?.blog.likes)
            setLiked(response.data?.liked)
        } catch (error) {
            if (error.response?.data?.msg == `unauthorized`) {
                toast.error(error.response?.data?.msg)
                navigate('/login')
            }
        }
    }

    const likeBlog = async (blogId) => {
        try {
            setLoading(true)
            const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/v1/user/${blogId}`, {}, { withCredentials: true })
            setLiked(response.data?.liked)
            if (response.data?.msg === "liked") {
                toast.success(response.data?.msg)
            }
            setBlogLikes(response.data?.blogLikes?.likes)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            if (error.response?.data?.msg == `unauthorized`) {
                toast.error(error.response?.data?.msg)
                navigate('/login')
            }
        }
    }

    const deleteBlog = async (blogId) => {
        try {
            setDeleteLoading(true)
            const response = await axios.delete(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/v1/user/${blogId}`, {
                withCredentials: true
            })
            if (response.data?.msg === 'Deleted') {
                toast.success(response.data?.msg)
                setDeleteLoading(false)
                navigate('/blogs/all')
            }
        } catch (error) {
            setDeleteLoading(false)
            if (error.response?.data?.msg == `unauthorized`) {
                toast.error(error.response?.data?.msg)
                navigate('/login')
            }
        }
    }

    useEffect(() => {
        getBlogById()
    }, [blogId])
    return (
        <>
            <Navbar />
            {blog ?
                <>
                    <div className='max-w-screen mt-10'>
                        <div className="artboard artboard-horizontal mx-auto flex justify-center items-center mb-10 mt-10">
                            <img src={blog?.image} className='rounded-3xl' width={600} />
                        </div>
                        <div className='flex items-center justify-center text-xl'>
                            <Link className='mr-10 p-3 mt-5'>@{blog?.owner?.username}</Link>
                            <div className='mr-10 flex gap-2 p-3 mt-5'>
                                <p>
                                    {String(new Date(blog?.createdAt)).split(' ')[0]}
                                </p>/
                                <p>
                                    {String(new Date(blog?.createdAt)).split(' ')[1]}
                                </p>/
                                <p>
                                    {String(new Date(blog?.createdAt)).split(' ')[2]}
                                </p>/
                                <p>
                                    {String(new Date(blog?.createdAt)).split(' ')[3]}
                                </p>
                            </div>
                            <div className='flex items-center mt-5 gap-3'>
                                <button className={`${liked ? "bg-gray-200" : ""} hover:cursor-pointer h-10 w-10 rounded-xl`} onClick={
                                    () => {
                                        likeBlog(blog?._id)
                                    }}>
                                    👍
                                </button>
                                {
                                    loading ? <span className="loading loading-spinner loading-xs"></span>
                                        : <p>{blogLikes}</p>
                                }
                            </div>
                        </div>
                        <div className='flex items-center justify-center mt-3 gap-5'>
                            {(localStorage.getItem('loggedInUser') === blog?.owner?.username) ?
                                <>
                                    <button className='bg-green-600 hover:bg-green-700 text-l rounded-xl font-bold text-white btn' onClick={() => navigate(`/${blog?._id}/update`, {
                                        state: {
                                            collection: blog?.parentCollection?.collectionName
                                        }
                                    })}>Update Blog</button>
                                    <button className="bg-red-500 hover:bg-red-600 text-l rounded-xl font-bold text-white btn" onClick={() => document.getElementById('my_modal_4').showModal()}>Delete Blog</button>
                                    <dialog id="my_modal_4" className="modal">
                                        <div className="modal-box w-1/2 max-w-5xl">
                                            <h3 className="font-bold text-lg">Are You Sure ?</h3>
                                            <div className="modal-action">
                                                <form method="dialog">
                                                    <button className="btn rounded-xl font-bold mx-3" onClick={() => deleteBlog(blog?._id)}>{deleteLoading ?
                                                        <div className='flex items-center gap-3'>
                                                            Deleting Blog ...
                                                            <span class="loading loading-spinner loading-sm"></span>
                                                        </div>
                                                        : `Yes`}</button>
                                                    <button className="btn rounded-xl font-bold mx-3">No</button>
                                                </form>
                                            </div>
                                        </div>
                                    </dialog>

                                </>
                                : <></>}
                        </div>
                        <div className='flex items-center justify-center mt-10'>
                            <h1 className='text-3xl font-bold'>{blog.title}</h1>
                        </div>
                        <div className=' max-w-[70vw] m-auto text-xl rounded-xl mt-10 p-5 text-left'
                        >
                            <div dangerouslySetInnerHTML={{ __html: he.decode(blog?.content).trim() }} />
                        </div>
                    </div>
                </> :
                <div className="flex flex-col gap-4 mt-10 items-center justify-center w-full">
                    <Skeleton />
                </div>
            }
        </>
    )
}

export default BlogById