import React, { useEffect, useState } from 'react'
import axios from "axios"
import { BiSolidLike } from "react-icons/bi"
import Navbar from './Navbar'
import LikedOrYourBlogs from './LikedOrYourBlogs'
import { Link, useNavigate } from 'react-router-dom'

const Profile = () => {
    // feed/your-blogs
    const [user, setUser] = useState(null)
    const [username, setUsername] = useState('')
    const [activeTab, setActiveTab] = useState('Your Blogs')

    const getProfile = async () => {
        try {
            setActiveTab('Your Blogs')
            const response = await axios.get(`http://localhost:5000/api/v1/user/feed/your-blogs`, { withCredentials: true })
            console.log(response?.data?.yourBlogs?.blogs)
            setUser(response?.data?.yourBlogs?.blogs)
            setUsername(response.data?.yourBlogs?.username)
        } catch (error) {
            console.log(error.response?.data?.msg)
        }
    }

    const getYourLikedBlogs = async () => {
        try {
            setActiveTab("Your Liked Blogs")
            const response = await axios.get('http://localhost:5000/api/v1/user/feed/yourLikedBlogs', { withCredentials: true })
            setUser(response?.data?.blogs?.likedBlogs)
            // setUsername(response.data?.yourBlogs?.username)
            // console.log(response?.data?.blogs?.likedBlogs)
        } catch (error) {

        }
    }

    useEffect(() => {
        getProfile()
    }, [])

    return (
        <>
            <Navbar />
            <div className='flex items-center flex-col justify-around mt-10'>
                <div className='text-5xl'>
                    <h1 className='flex'>Hello! <p className='ml-2 font-bold'>@{username}</p></h1>
                </div>
                <div className='mt-10 w-1/2'>
                    <div className='text-xl font-bold flex justify-center items-center'>
                        <div className={`${activeTab === 'Your Blogs' ? `underline underline-offset-8 decoration-sky-500 decoration-8` : ``}`}
                            onClick={getProfile}
                        >
                            <Link className='mx-20'>Your Blogs</Link>
                        </div>
                        <div className={`${activeTab === 'Your Liked Blogs' ? `underline underline-offset-8 decoration-sky-500 decoration-8` : ``}`}
                        onClick={getYourLikedBlogs}
                        >
                            <Link className='mx-20'>Your Liked Blogs</Link>
                        </div>
                    </div>
                    <div className='flex justify-center flex-wrap gap-10 mt-10'>
                        <LikedOrYourBlogs userBlog={user} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Profile