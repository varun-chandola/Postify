import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import App from './App.jsx'
import Signup from "./components/Signup.jsx"
import Login from "./components/Login.jsx"
import AllPosts from "./components/AllPosts.jsx"
import NewBlog from './components/NewBlog.jsx'
import BlogById from './components/BlogById.jsx'
import Profile from './components/Profile.jsx'
import Community from "./components/Community.jsx"
import UpdateBlogs from "./components/UpdateBlogs.jsx"
import Logout from "./components/Logout.jsx"
import Missing from './components/Missing.jsx'
import { Toaster } from "react-hot-toast"
import './index.css'
import Context from './context/Context.jsx'
import CreateCollection from './components/CreateCollection.jsx'
import Navbar from './components/Navbar.jsx'
import Collection from './components/Collection.jsx'
import Footer from './components/Footer.jsx'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <Context>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/blogs/all' element={<AllPosts />} />
        <Route path='/blog/create' element={<NewBlog />} />
        <Route path='/blog/:blogId' element={<BlogById />} />
        <Route path='/:blogId/update' element={<UpdateBlogs />} />
        <Route path='/feed/profile' element={<Profile />} />
        <Route path='/feed/community' element={<Community />} />
        <Route path='/feed/settings' element={<Logout />} />
        <Route path='/create/new-collection' element={<CreateCollection />} />
        <Route path='/:collectionName/blogs' element={<Collection />} />
        <Route path='*' element={<Missing />} />
      </Routes>
      <Footer />
      <Toaster />
    </BrowserRouter >
  </Context>
  // </StrictMode>,
)
