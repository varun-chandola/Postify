import axios from 'axios'
import React, { useContext, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from './Navbar'
import { AuthContext } from '../context/Context'

const UpdateBlogs = () => {
    const { authUser, setAuthUser } = useContext(AuthContext)
    const { blogId } = useParams()
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [tags, setTags] = useState('')
    const [file, setFile] = useState('')
    const navigate = useNavigate()


    const handleUpdateBlog = async (e) => {
        const formData = new FormData()
        formData.append('title', title)
        formData.append('content', content)
        formData.append('tags', tags)
        formData.append('new-blog-image', file)
        e.preventDefault()
        try {
            const response = await axios.patch(`http://localhost:5000/api/v1/user/${blogId}`, formData, { withCredentials: true })
            if (response.data?.msg === "update details")
                navigate(`/blog/${blogId}`)
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <>
            <Navbar />
            <form className='flex flex-col bg-white p-6 shadow-md rounded-lg max-w-2xl mx-auto mt-10'
                onSubmit={handleUpdateBlog}
            >
                <input
                    type="text"
                    className='bg-gray-100 text-4xl p-3 focus:outline-none mb-6 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500'
                    placeholder='New Title*'
                    // required
                    onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                    className='bg-gray-100 p-3 focus:outline-none mb-6 text-2xl rounded-md h-40 border border-gray-300 focus:ring-2 focus:ring-blue-500'
                    placeholder='Content*'
                    // required
                    onChange={(e) => setContent(e.target.value)}
                />
                <input
                    type="text"
                    className='bg-gray-100 p-3 focus:outline-none mb-6 text-2xl rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500'
                    placeholder='Tags*'
                    // required
                    onChange={(e) => setTags(e.target.value)}
                />
                <input
                    className="bg-white border border-gray-300 text-gray-700 rounded-lg file:bg-blue-50 file:border-0 file:py-2 file:px-4 file:mr-4 file:text-blue-700 file:font-semibold hover:file:bg-blue-100 mb-6 cursor-pointer"
                    type="file"
                    required
                    onChange={(e) => setFile(e.target.files[0])}
                />
                <button
                    className='bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors'
                >
                    Post
                </button>
            </form>
        </>
    )
}

export default UpdateBlogs