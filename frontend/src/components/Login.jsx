import axios from 'axios';
import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/Context';

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const { setAuthUser } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/v1/user/login`, {
        username,
        password
      }, { withCredentials: true })

      if (response.data?.msg === "Login successful") {
        localStorage.setItem('loggedInUser', username)
        toast.success(response?.data?.msg)
        navigate('/blogs/all')
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
      setErrorMessage(error?.response?.data?.msg)
    }
  }

  return (
    <>
      <div className="flex w-[60vw] justify-between items-center mx-auto p-4 mt-5 bg-white shadow-md rounded-xl">
        <Link to="/" className="font-extrabold text-2xl">postify</Link>
        <Link to="/login" className="hover:underline">
          create
        </Link>
      </div>

      <div className="flex flex-col items-center justify-center min-h-screen">
        <form
          className="bg-white p-8 rounded-2xl shadow-lg w-[90%] max-w-md"
          onSubmit={handleSubmit}
        >
          <h2 className="text-center text-3xl font-bold mb-6 text-gray-800">Login to Postify</h2>
          <div className="flex flex-col space-y-4">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
            <button
              type="submit"
              className="bg-blue-600 text-white text-lg font-bold py-3 rounded-lg hover:bg-blue-700 transition"
            >
              {loading ? <span className="loading loading-spinner text-white"></span> :
                "Login"
              }
            </button>
          </div>
          <p className="text-center mt-4">
            New User?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline">Sign In</Link>
          </p>
        </form >
      </div >

    </>
  );
};

export default Login;
