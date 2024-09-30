import React, { useState } from 'react'
import axios from "axios"

const AllPosts = async () => {
  const [allPosts, setAllPosts] = useState("")

  try {
    const response = await axios.get('http://localhost:5000/api/v1/user/blogs/all', { withCredentials: true })
    console.log(response.data)
  } catch (error) {
    console.log("error in all post\n", error.message)
  }
  return (
    <div>
      <h1>All Blogs</h1>
    </div>
  )
}

export default AllPosts