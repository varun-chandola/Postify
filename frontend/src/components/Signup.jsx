import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import axios from "axios"

const Signup = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [file, setFile] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('username', username)
    formData.append('password', password)
    formData.append('email', email)
    if (file != '') {
      formData.append('avatar', file)
    }

    try {
      setLoading(true)
      const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/v1/user/signup`, formData, {
        withCredentials: true
      })
      if (response?.data?.msg == `User Registration Successful`) {
        toast.success(response?.data?.msg)
        setLoading(false)
        navigate('/login')
      }
    } catch (error) {
      setLoading(false)
      toast.error(error.response?.data?.msg)
      if (error.msg == "unauthorized")
        navigate('/login')
    }
  }

  return (
    <>
      <div className="flex w-[60vw] justify-between items-center mx-auto p-4 mt-5 bg-white shadow-md rounded-xl">
        <Link to="/" className="font-extrabold text-2xl">postify</Link>
        <Link to="/login" className="hover:underline">create</Link>
      </div>

      <div className="flex flex-col items-center justify-center min-h-screen">
        <form
          encType="multipart/form-data"
          onSubmit={handleFormSubmit}
          className="bg-white p-8 rounded-2xl shadow-lg w-[90%] max-w-md"
        >
          <h2 className="text-center text-3xl font-bold mb-6 text-gray-800">Sign Up</h2>
          <div className="flex flex-col space-y-4">
            <input
              type="text"
              placeholder="Username"
              required
              className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              required
              className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              required
              className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="file"
              name="avatar"
              className="w-full bg-gray-100 rounded-xl focus:outline-none p-3 file:p-3 file:rounded-lg file:bg-gray-700 file:text-white border border-gray-300"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <button
              type="submit"
              className="bg-blue-600 text-white text-lg font-bold py-3 rounded-lg hover:bg-blue-700 transition"
            >
              {loading ? <span className="loading loading-spinner text-white"></span> :
                "Sign Up"
              }
            </button>
          </div>
          <p className="text-center mt-4">
            Already a user?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
          </p>
        </form>
      </div>
    </>
  );

};

export default Signup;