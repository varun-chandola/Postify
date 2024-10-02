import axios from 'axios';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/Context';

const Login = () => {
  const { authUser, setAuthUser } = useContext(AuthContext)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:5000/api/v1/user/login', {
        username,
        password
      }, { withCredentials: true })

      if (response.data?.token) {
        setAuthUser(username)
        toast.success(response?.data?.msg)
        navigate('/blogs/all')
      }
    } catch (error) {
      setErrorMessage(error.response.data.msg)
    }
  }

  return (
    <div className="flex items-center justify-center h-[100vh]">
      <form
        className="w-1/2"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full focus:outline-none p-3 bg-gray-100 rounded-2xl mb-4 text-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 "
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full focus:outline-none p-3 bg-gray-100 rounded-2xl mb-4 text-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 "
        />
        <p className='flex flex-start p-1 text-l text-red-700' >{errorMessage}</p>
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
