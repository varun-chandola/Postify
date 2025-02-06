import React, { useEffect, useState } from 'react'
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import toast from "react-hot-toast"

const CreateCollection = () => {
    const navigate = useNavigate()
    const [userCollection, setUserCollection] = useState([])
    const [collectionName, setCollectionName] = useState('')

    const getUserCollection = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/v1/user/feed/yourCollections`, { withCredentials: true })
            setUserCollection(response.data?.userCollections)
        } catch (error) {
            if (error.response?.data?.msg == `unauthorized`) {
                toast.error(error.response?.data?.msg)
                navigate('/login')
            }
        }
    }

    const createCollection = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/v1/user/feed/create-collection`, {
                collection: collectionName
            }, { withCredentials: true })
            toast.success(response.data?.msg)
            setCollectionName('')
            getUserCollection()
        } catch (error) {
            if (error.response?.data?.msg == `unauthorized`) {
                toast.error(error.response?.data?.msg)
                navigate('/login')
            }
        }
    }

    useEffect(() => {
        getUserCollection()
    }, [])

    return (
        <>
            <Navbar />
            <div className='flex items-center justify-center'>
                <div className='flex flex-wrap gap-5 items-center justify-center'>
                    <h1 className='w-full text-center text-xl font-bold mt-3'>Available <span className='bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-transparent bg-clip-text font-extrabold ml-2'>Collections</span></h1>
                    {userCollection.map(each => (
                        <div key={each._id} className="card bg-base-100 w-96 shadow-xl hover:cursor-pointer h-[200px] hover:shadow hover:shadow-lg hover:shadow-gray-500" onClick={() => navigate(`/${each.collectionName}/blogs`)}>
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
            <div className='flex items-center justify-center flex-col'>
                <h1 className='text-xl font-bold mt-7'>Create New
                    <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-transparent bg-clip-text font-extrabold ml-2">
                        Collection</span></h1>
                <form className='flex flex-col' onSubmit={e => {
                    e.preventDefault()
                    createCollection()
                }}>
                    <input type='text' placeholder='Collection Name' className='p-2 rounded-xl w-[50vw] mt-3 shadow shadow-xl focus:border-sky-500 focus:ring-2 focus:ring-sky-500 focus:outline-none' value={collectionName} onChange={e => setCollectionName(e.target.value)} />
                    <button type='submit' className='mt-3 p-2 bg-black w-1/4 mx-auto rounded-xl text-white mb-10'>Create</button>
                </form>
            </div>
        </>
    )
}

export default CreateCollection