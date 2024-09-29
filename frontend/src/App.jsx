import { useState } from 'react'
import { Link } from 'react-router-dom'
import './App.css'

function App() {
  return (
    <>
      <Link to='/login'><button className='bg-blue-400 p-5 rounded-xl text-xl' >Login</button></Link>
    </>
  )
}

export default App
