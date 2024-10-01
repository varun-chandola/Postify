import React, { useEffect, useState } from 'react'
import { BiSolidLike } from "react-icons/bi";
import axios from "axios"
import { useNavigate } from 'react-router-dom';

const AllPosts = () => {
  const [like, setLike] = useState(0)
  const [allBlogs, setAllBlogs] = useState([])
  const navigate = useNavigate()
  // console.log(document.cookie?.split('=')[1])
  const fetchBlogs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/user/blogs/all', { withCredentials: true })
      setAllBlogs(response.data?.allBlogs)
      console.log(response.data?.allBlogs)
    } catch (error) {
      console.log("error in all post\n", error.message)
    }
  }

  const liked = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/api/v1/user/:blogId`)
    } catch (error) {
      console.log(error)
    }
  }


  useEffect(() => {
    fetchBlogs()
  }, [allBlogs.length])

  return (
    <>
      <h1>Recent Blog Posts</h1>
      <div className='flex flex-wrap gap-10 mt-10'>
        {allBlogs.map(each =>
          <div key={each._id} className='flex flex-col flex-wrap' onClick={()=>navigate('')}>
            <div className='mb-5'>
              <img src={each.image} width={350} className='rounded-3xl' />
            </div>
            <div className='flex flex-start max-w-350'>
              <h1 className='text-2xl font-bold'>{each.title}</h1>
            </div>
            <div className='flex flex-start max-w-[350px]'>
              <p className='text-left text-l max-h-[70px] overflow-hidden'>{each.content}</p>
            </div>
            <div className='flex mt-5 items-center'>
              <img className='rounded-full w-10 h-9 mr-5' src={each.owner.avatar} />
              <h1 className='text-l font-bold'>{each.owner.username}</h1>
            </div>
            <div className='flex flex-wrap mt-5'>
              {each.tags?.[0].split(',').map((tag, index) => (
                <button key={index} className="mr-5 bg-gray-100 p-2 rounded-l">
                  {tag.trim()}
                </button>
              ))}
            </div>
            <div className='flex text-2xl items-center mt-3'>
              <BiSolidLike onClick={liked} className='mr-3 hover:cursor-pointer' />
              <p>{each.likes}</p>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default AllPosts