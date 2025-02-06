import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import Navbar from './Navbar'
import { AuthContext } from '../context/Context'
import ReactQuill from 'react-quill'
import Skeleton from "./Skeleton"
import 'react-quill/dist/quill.snow.css';
import toast from "react-hot-toast"

const UpdateBlogs = () => {
    const { userCollections } = useContext(AuthContext)
    const { blogId } = useParams()
    const [content, setContent] = useState('')
    const [title, setTitle] = useState('')
    const [tags, setTags] = useState('')
    const [collection, setCollection] = useState('')
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [previousCollection, setPreviousCollection] = useState(useLocation().state?.collection)
    const [loadingContent, setLoadingContent] = useState(false)
    console.log('prevcoll', previousCollection)

    const getBlogDetails = async (blogId) => {
        try {
            setLoadingContent(true)
            const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/v1/user/${blogId}`, { withCredentials: true })
            console.log(response?.data)
            if (response.data) {
                setLoadingContent(false)
                setTitle(response?.data?.blog?.title)
                setContent(response?.data?.blog?.content)
                setTags(response?.data?.blog?.tags)
                setCollection(response?.data?.blog?.parentCollection?.collectionName)
            }
        } catch (error) {
            setLoadingContent(false)
            if (error.response?.data?.msg == `unauthorized`) {
                toast.error(error.response?.data?.msg)
                navigate('/login')
            }
        }
    }

    useEffect(() => {
        getBlogDetails(blogId)
    }, [])

    const debounce = (func, delay) => {
        let timer
        return function (...args) {
            clearTimeout(timer)
            timer = setTimeout(() => {
                func(...args)
            }, delay);
        }
    }

    const debounceUpdateContent = debounce(function (updatedContent) {
        setContent(updatedContent)
    }, 400)

    const handleUpdateBlog = async (e) => {
        try {
            e.preventDefault()
            setLoading(true)
            const response = await axios.patch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/v1/user/${blogId}`, {
                title,
                content,
                tags,
                collection,
                previousCollection
            }, { withCredentials: true })
            if (response.data?.msg === "updates successful") {
                toast.success(response.data?.msg)
                navigate(`/blog/${blogId}`)
                setLoading(false)
            }
        } catch (error) {
            setLoading(false)
            if (error.response?.data?.msg == `unauthorized`) {
                toast.error(error.response?.data?.msg)
                navigate('/login')
            }
        }
    }

    return (
        <>
            <Navbar />
            <div className='flex items-center justify-center mt-5 text-xl gap-2'>
                <h1>Update</h1>
                <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-transparent bg-clip-text font-extrabold">
                    Blog
                </span>
            </div>
            {loadingContent ?
                <div className='flex items-center justify-center mt-10'>
                    <Skeleton />
                </div>
                :
                <form className='flex flex-col w-1/2 mx-auto mt-10'
                    onSubmit={handleUpdateBlog}
                    encType="multipart/form-data"
                >
                    <input
                        type="text"
                        className='bg-gray-100 text-xl p-2 focus:outline-none mb-6 rounded-xl focus:ring-2 focus:ring-blue-500'
                        placeholder='Updated Title'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <input
                        type="text"
                        className='bg-gray-100 text-xl p-2 focus:outline-none mb-6 rounded-xl focus:ring-2 focus:ring-blue-500'
                        placeholder='New Tag1 , New Tag2 , New Tag3'
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                    />
                    <p className=''>Current Collection : {previousCollection}</p>
                    <select className='p-2 rounded-xl outline-none shadow shadow-sm border' value={collection} onChange={e => setCollection(e.target.value)}>
                        <option value={""}>Select A Collection</option>
                        {userCollections.map(each => (
                            <option key={each._id} value={each.name}>{each.collectionName}</option>
                        ))}
                    </select>
                    <div className='mt-2'>
                        <ReactQuill
                            className="rounded-xl p-2 h-[25vh] mb-8"
                            theme='snow'
                            value={content}
                            onChange={debounceUpdateContent} />
                    </div>
                    <button
                        className='bg-blue-600 text-white py-3 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-colors mt-4'
                    >
                        {
                            loading ?
                                <div className='flex items-center justify-center gap-2'>
                                    <p>Updating Blog....</p>
                                    <span className="loading loading-spinner loading-sm"></span>
                                </div>
                                : `Update`
                        }
                    </button>
                </form>
            }
        </>
    )
}

export default UpdateBlogs