import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import Skeleton from './Skeleton'

const Blog = ({ userBlog, loading }) => {
  const navigate = useNavigate(0)
  return userBlog?.length == 0 ? <div className='flex  flex-col text-center h-screen'>
    <h1 className='text-3xl'>No Blogs Available</h1>
    <NavLink to='/blog/create' className='mt-5 bg-black p-2 rounded-xl text-xl text-white hover:bg-gray-800'>create</NavLink>
  </div> :
    (
      <>
        {loading ?
          <>
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </>
          :
          userBlog?.map(each =>
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
                  <p className=''>@{localStorage.getItem('loggedInUser')}</p>
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
      </>
    )
}
export default Blog