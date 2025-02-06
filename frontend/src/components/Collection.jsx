import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from './Navbar'
import Skeleton from './Skeleton'

const Collection = () => {
    const { collectionName } = useParams()
    const navigate = useNavigate()
    const [blogsInACollection, setBlogsInACollection] = useState([])
    const [loading, setLoading] = useState(true)
    const fetchBlogsInCollection = async () => {
        try {
            setLoading(true)
            const respone = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/v1/user/${collectionName}/blogs`, { withCredentials: true })
            if (respone.data?.allBlogsInThisCollection) {
                setBlogsInACollection(respone?.data?.allBlogsInThisCollection?.collectionChildrens)
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
    useEffect(() => {
        fetchBlogsInCollection()
    }, [])
    return blogsInACollection?.length == 0 ?
        <div>
            <Navbar />
            <h1 className='w-full mx-auto text-center font-extrabold text-xl mt-5'>{collectionName}</h1>
            <div className='flex flex-col items-center justify-center h-screen'>
                <h1 className='text-xl'>No Blogs in this Collection</h1>
                <button className='text-xl bg-black hover:bg-gray-800 text-white rounded-xl p-2 mt-10' onClick={() => navigate('/blog/create')}>Create</button>
            </div>
        </div>
        : (
            <>
                <Navbar />
                <div className='flex justify-center flex-wrap gap-10 mt-10 h-screen'>
                    <h1 className='w-full mx-auto text-center font-extrabold text-xl'>{collectionName}</h1>
                    {(loading) ?
                        <>
                            <Skeleton /><Skeleton /> <Skeleton />
                        </> :
                        blogsInACollection?.map(each =>
                            <div className="card card-compact bg-base-100 w-96 shadow-xl hover:cursor-pointer hover:shadow-gray-300" key={each?._id} onClick={() => navigate(`/blog/${each._id}`)}>
                                <figure>
                                    <img
                                        src={`${each?.image}`}
                                        alt={`${each?.title}`} />
                                </figure>
                                <div className="card-body">
                                    <h2 className="card-title">{each?.title}</h2>
                                    <div className="card-actions justify-start items-center gap-5">
                                        <button className="btn btn-sm">👍{each?.likes}</button>
                                        <p className=''>@{each?.owner?.username}</p>
                                    </div>
                                    <div className='flex flex-wrap mt-5'>
                                        {each.tags?.[0].split(',').map((tag, index) => (
                                            <button key={index} className="mr-5 mb-3 bg-gray-100 p-1 rounded-l">
                                                {tag.trim()}
                                            </button>
                                        ))}
                                    </div >
                                </div>
                            </div>
                        )
                    }
                </div >
            </>
        )
}

export default Collection