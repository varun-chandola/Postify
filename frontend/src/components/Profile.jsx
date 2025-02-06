import React, { useEffect, useState } from 'react'
import axios from "axios"
import Navbar from './Navbar'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast';
import Blog from './Blog';

const Profile = () => {
    const [profile, setProfile] = useState([])
    const [username, setUsername] = useState('')
    const [activeTab, setActiveTab] = useState('Your Blogs')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const getProfile = async () => {
        try {
            setLoading(true)
            setActiveTab('Your Blogs')
            const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/v1/user/feed/profile`, { withCredentials: true })
            setProfile(response?.data?.userProfile)
            setUsername(localStorage.getItem('loggedInUser'))
            setLoading(false)
        } catch (error) {
            if (error.response?.data?.msg == 'unauthorized') {
                toast.error(error.response?.data?.msg)
                navigate('/login')
                setLoading(false)
            }
        }
    }

    const getYourLikedBlogs = async () => {
        try {
            setLoading(true)
            setActiveTab("Your Liked Blogs")
            const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/v1/user/feed/yourLikedBlogs`, { withCredentials: true })
            setProfile(response?.data?.blogs?.likedBlogs)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            if (error.response?.data?.msg == `unauthorized`) {
                toast.error(error.response?.data?.msg)
                navigate('/login')
            }
        }
    }

    const getYourCollections = async () => {
        try {
            setLoading(true)
            setActiveTab('Your Collections')
            const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/v1/user/feed/yourCollections`, {
                withCredentials: true
            })
            setProfile(response.data?.userCollections)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            if (error.response?.data?.msg == `unauthorized`) {
                toast.error(error.response?.data?.msg)
                navigate('/login')
            }
        }
    }

    function Collection() {
        return (
            <div className='h-screen'>
                <div className='flex flex-wrap gap-5 items-center justify-center'>
                    <h1 className='w-full text-center text-xl font-bold mt-3'>Available <span className='bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-transparent bg-clip-text font-extrabold ml-2'>Collections</span></h1>
                    {profile.map(each => (
                        <div key={each._id} className="card bg-base-100 w-96 shadow-xl hover:cursor-pointer h-[200px] hover:shadow hover:shadow-lg hover:shadow-gray-500" onClick={() => navigate(`/${each?.collectionName}/blogs`)}>
                            <figure className=''>
                                <img
                                    src="https://e1.pngegg.com/pngimages/525/771/png-clipart-next-folders-icon-blank-blue-folder-icon-thumbnail.png"
                                    alt="Document" className='h-[150px] mt-4' />
                            </figure>
                            <div className="card-body flex items-center">
                                <h2 className="card-title">{each.collectionName}</h2>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    useEffect(() => {
        getProfile()
    }, [])

    return (
        <>
            <Navbar />
            <div className='flex items-center flex-col justify-between mt-10'>
                <div className='text-5xl'>
                    <h1 className='flex'>Hello! <p className='ml-2 font-bold'>@{username}</p></h1>
                </div>
                <div className='mt-10'>
                    <div className='text-xl font-bold flex justify-center  items-center flex-col md:flex-row  '>
                        <div className={`${activeTab === 'Your Blogs' ? `underline underline-offset-8 decoration-sky-500 decoration-8` : ``} mb-4 `}
                            onClick={getProfile}
                        >
                            <Link className='mx-20'>Your Blogs</Link>
                        </div>
                        <div className={`${activeTab === 'Your Liked Blogs' ? `underline underline-offset-8 decoration-sky-500 decoration-8` : ``} mb-4`}
                            onClick={getYourLikedBlogs}
                        >
                            <Link className='mx-20'>Your Liked Blogs</Link>
                        </div>
                        <div className={`${activeTab === 'Your Collections' ? `underline underline-offset-8 decoration-sky-500 decoration-8` : ``} mb-4 `}
                            onClick={getYourCollections}
                        >
                            <Link className='mx-20'>Your Collections</Link>
                        </div>
                    </div>
                    <div className='flex justify-center flex-wrap gap-10 mt-10'>
                        {activeTab === 'Your Collections' ? <Collection /> : <Blog loading={loading} userBlog={profile} />
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default Profile