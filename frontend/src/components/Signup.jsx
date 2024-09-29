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
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        className="bg-white p-8 rounded-lg shadow-md w-80"
        encType="multipart/form-data"
        onSubmit={handleFormSubmit}
      >
        <h2 className="text-2xl font-semibold text-center mb-6">Create Account</h2>
        <input type="text" placeholder="Username" required
          className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email" placeholder="Email" required
          className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password" placeholder="Password" required
          className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="file"
          name='avatar'
          className='w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:border-blue-500 avatar'
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
