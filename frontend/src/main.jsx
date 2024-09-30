import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import App from './App.jsx'
import Signup from "./components/Signup.jsx"
import Login from "./components/Login.jsx"
import AllPosts from "./components/AllPosts.jsx"
import './index.css'
import NewBlog from './components/NewBlog.jsx'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/login' element={<Login />} />
      <Route path='/blogs/all' element={<AllPosts />} />
      <Route path='/blog/create' element={<NewBlog />} />
    </Routes>
  </BrowserRouter>
  // </StrictMode>,
)
