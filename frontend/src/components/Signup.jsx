import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import axios from "axios"

const Signup = () => {

  // debouncing waits to run the function again .
  /*
  Debouncing ka simple concept yeh hai ki hum ek function ko tab tak delay karte hain jab tak user koi continuous action kar raha ho, jaise typing. Jab user thodi der ke liye ruk jata hai, tab hi humara function execute hota hai.
  For example, agar tumhara user search bar mein type kar raha hai, tum chahte ho ki API call tab ho jab user typing bandh kare, instead of calling it on every keystroke.
  */
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [file, setFile] = useState('')
  const navigate = useNavigate()



  // const debounce = (func, delay) => {
  //   let timer
  //   return (...args) => {
  //     clearInterval(timer)
  //     timer = setTimeout(() => {
  //       console.log('here')
  //       func(...args)
  //     }, delay)
  //   }
  // }


  // const debouncedUsernameChange = debounce((e) => {
  //   setUsername(e.target.value)
  // }, 400)

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('username', username)
    formData.append('password', password)
    formData.append('email', email)
    formData.append('avatar', file)

    try {
      const response = await axios.post('http://localhost:5000/api/v1/user/signup', formData)
      if (response?.data?.msg) navigate('/login')
    } catch (error) {
      console.log("error signing up")
      console.log(error.message)
    }
  }

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-800 p-6'>
      <div className='bg-white p-8 rounded-lg shadow-lg max-w-md w-full'>
        <form
          encType="multipart/form-data"
          onSubmit={handleFormSubmit}
        >
          <h2 className="text-3xl font-semibold mb-6 text-center text-gray-900">Sign Up</h2>

          <input type="text" placeholder="Username" required
            className="w-full focus:outline-none p-3 bg-gray-100 rounded-2xl mb-4 text-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="email" placeholder="email@gmail.com" required
            className="w-full focus:outline-none p-3 bg-gray-100 rounded-2xl mb-4 text-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password" placeholder="Password" required
            className="w-full focus:outline-none p-3 bg-gray-100 rounded-2xl mb-4 text-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="file"
            name='avatar'
            className="w-full bg-gray-100 rounded-2xl focus:outline-none p-3 file:p-3 file:rounded-xl file:bg-gray-700 file:text-white mb-4 border border-gray-300"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button
            type="submit"
            className="bg-blue-600 p-3 text-white w-full rounded-xl text-lg transition duration-300 hover:bg-blue-700"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
