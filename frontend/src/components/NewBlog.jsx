import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from './Navbar'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import toast from 'react-hot-toast';
import { AuthContext } from "../context/Context"

const NewBlog = () => {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState(``)
    const [tags, setTags] = useState('')
    const [file, setFile] = useState('')
    const [collection, setCollection] = useState('')
    const { userCollections } = useContext(AuthContext)
    const [loading, setLoading] = useState(false)
    const [draftLoading, setDraftLoading] = useState(false)
    const navigate = useNavigate()

    const debounce = (func, delay) => {
        let timer
        return (...args) => {
            clearTimeout(timer)
            timer = setTimeout(() => {
                func(...args)
            }, delay)
        }
    }

    const debounceTitle = debounce((title) => {
        setTitle(title)
    }, 500)

    const debounceTags = debounce((tags) => {
        setTags(tags)
    }, 500)

    const debouncedContent = debounce(
        (content) => {
            setContent(content)
            // localStorage.setItem('draft', content)
        }, 3000)

    const handleCreatePost = async (e) => {
        const formData = new FormData()
        formData.append('title', title)
        formData.append('content', content)
        formData.append('tags', tags)
        formData.append('blog-image', file)
        formData.append('collection', collection)

        e.preventDefault()
        try {
            setLoading(true)
            const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/v1/user/blog/create`, formData, { withCredentials: true })
            toast.success(response.data?.msg)
            navigate('/blogs/all')
            setLoading(false)
        } catch (error) {
            setLoading(false)
            if (error.response?.data?.msg == `unauthorized`) {
                toast.error(error.response?.data?.msg)
                navigate('/login')
            }
        }
    }

    const createDraft = async () => {
        const formData = new FormData()
        formData.append('title', title)
        formData.append('content', content)
        formData.append('tags', tags)
        formData.append('blog-image', file)
        formData.append('collection', collection)

        try {
            const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/v1/user/blog/draft`, formData, {
                withCredentials: true
            })
        } catch (error) {
            toast.error(error.response?.data?.msg)
        }
    }

    return (
        <>
            <Navbar />
            <div className='flex items-center justify-center mt-5 text-xl gap-2'>
                <h1>Create A New</h1>
                <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-transparent bg-clip-text font-extrabold">
                    Blog !
                </span>
            </div>
            <form className='flex flex-col w-1/2 mx-auto mt-10' onSubmit={handleCreatePost}>
                <input
                    type="text"
                    className='bg-gray-100 text-xl p-2 focus:outline-none mb-6 rounded-xl focus:ring-2 focus:ring-blue-500'
                    placeholder='Title'
                    required
                    onChange={(e) => debounceTitle(e.target.value)}
                />
                <input
                    type="text"
                    className='bg-gray-00 text-xl p-2 focus:outline-none mb-6 rounded-xl focus:ring-2 focus:ring-blue-500'
                    placeholder='Next.js , Typescript , React.js'
                    onChange={(e) => debounceTags(e.target.value)}
                />
                <input
                    className="bg-white border border-gray-300 text-gray-700 rounded-xl file:bg-blue-50 file:border-0 file:py-2 file:px-4 file:mr-4 file:text-blue-700 file:font-semibold hover:file:bg-blue-100 mb-6 cursor-pointer"
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                />
                <select className='p-2 rounded-xl outline-none shadow shadow-sm border' value={collection} onChange={e => setCollection(e.target.value)}>
                    <option value={""}>Select A Collection</option>
                    {userCollections.map(each => (
                        <option key={each._id} value={each.name}>{each.collectionName}</option>
                    ))}
                </select>
                <div className='mt-5'>
                    <ReactQuill
                        className="h-[30vh] mb-10"
                        theme='snow'
                        value={content}
                        onChange={debouncedContent} />
                </div>
                <button
                    className='bg-blue-600 text-white py-3 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-colors mt-10'
                >
                    {loading ?
                        <div className='flex items-center justify-center gap-4'>
                            Posting...
                            <span class="loading loading-spinner loading-xs"></span>
                        </div>
                        :
                        `POST `
                    }
                </button>
            </form>
            <div className='flex w-1/2 mx-auto mt-4 items-center justify-center gap-5 mx-8 mb-10'>
                <button
                    className='bg-black text-white py-3 rounded-xl text-lg font-semibold hover:bg-gray-800 transition-colors p-3 w-full'
                    onClick={createDraft}
                >
                    {draftLoading ?
                        <div className='flex items-center justify-center gap-4'>
                            Saving As Draft...
                            <span class="loading loading-spinner loading-xs"></span>
                        </div>
                        :
                        `Save As Draft `
                    }
                </button>
                <button
                    className='bg-gray-600 text-white py-3 rounded-xl text-lg font-semibold hover:bg-gray-700 transition-colors  p-3 w-full'
                    onClick={() => navigate('/create/new-collection')}
                >
                    Create New Collection
                </button>
            </div>
        </>
    )
}

export default NewBlog