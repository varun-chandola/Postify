import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from './Navbar'


const NewBlog = () => {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [tags, setTags] = useState('')
    const [file, setFile] = useState('')
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
    const debouncedContent = debounce((value) => {
        setContent(value)
    }, 200)

    const handleCreatePost = async (e) => {
        const formData = new FormData()
        formData.append('title', title)
        formData.append('content', content)
        formData.append('tags', tags)
        formData.append('blog-image', file)

        e.preventDefault()
        try {
            const response = await axios.post('http://localhost:5000/api/v1/user/blog/create', formData, { withCredentials: true })
            console.log("response\n", response.data)
            if (response?.status == 200)
                navigate('/blogs/all')
        } catch (error) {
            alert(error.response.data.msg)
        }
    }
    return (
        <>
            <Navbar />
            <form className='flex flex-col p-6 shadow-md rounded-lg max-w-2xl mx-auto mt-10 bg-gray-900' onSubmit={handleCreatePost}>
                <input
                    type="text"
                    className='bg-gray-100 text-4xl p-3 focus:outline-none mb-6 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500'
                    placeholder='Title*'
                    required
                    onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                    className='bg-gray-100 p-3 focus:outline-none mb-6 text-2xl rounded-xl h-40 border border-gray-300 focus:ring-2 focus:ring-blue-500'
                    placeholder='Content*'
                    required
                    onChange={(e) => debouncedContent(e.target.value)}
                />
                <input
                    type="text"
                    className='bg-gray-100 p-3 focus:outline-none mb-6 text-2xl rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500'
                    placeholder='Tags*'
                    required
                    onChange={(e) => setTags(e.target.value)}
                />
                <input
                    className="bg-white border border-gray-300 text-gray-700 rounded-xl file:bg-blue-50 file:border-0 file:py-2 file:px-4 file:mr-4 file:text-blue-700 file:font-semibold hover:file:bg-blue-100 mb-6 cursor-pointer"
                    type="file"
                    required
                    onChange={(e) => setFile(e.target.files[0])}
                />
                <button
                    className='bg-blue-600 text-white py-3 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-colors'
                >
                    Post
                </button>
            </form>
        </>
    )
}

export default NewBlog
