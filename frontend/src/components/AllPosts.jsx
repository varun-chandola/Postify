import React, { useEffect, useState } from 'react'
import axios from "axios"
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import toast from 'react-hot-toast';
import Skeleton from './Skeleton';

const AllPosts = () => {
  const [allBlogs, setAllBlogs] = useState([])
  const navigate = useNavigate()
  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/v1/user/blogs/all`, { withCredentials: true })
      setAllBlogs(response.data?.allBlogs)
    } catch (error) {
      if (error.response?.data?.msg == `unauthorized`) {
        toast.error(error.response?.data?.msg)
        navigate('/login')
      }
    }
  }

  useEffect(() => {
    fetchBlogs()
  }, [allBlogs.length])

  return (
    <>
      <Navbar />
      <h1 className='flex items-center justify-center mt-10 text-2xl'>All <span className='font-extrabold mx-2'>Blogs</span></h1>
      {allBlogs.length == 0 ?
        <div className='w-screen flex items-center justify-center flex-wrap gap-5 mt-10 gap-5'>
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </div>
        :
        <div className='md:max-w-1/3 flex justify-center flex-wrap gap-10 mt-10'>
          {allBlogs.map(each =>
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
          )}
        </div >
      }

    </>
  )
}

export default AllPosts