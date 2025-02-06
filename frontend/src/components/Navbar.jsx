import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { FaArrowLeft } from "react-icons/fa";


const Navbar = () => {
    const location = useLocation()
    return (
        <div className='flex p-5 text-xl transform transition-all duration-500 hover:shadow-xl mt-4 rounded-xl justify-center mx-auto gap-4 sm:w-[60vw] max-w-auto'>
            {
                location.pathname !== `/blogs/all` ?
                    <NavLink onClick={() => { window.history.back() }} className='mr-5 font-bold text-sm '><FaArrowLeft className='text-xl hover:text-blue-500' /></NavLink> : <></>
            }
            <NavLink to='/blogs/all' className='mr-5 font-bold text-sm hover:underline'>Recent</NavLink>
            <NavLink to='/blog/create' className='mr-5 text-sm font-bold hover:underline'>Create</NavLink>
            <NavLink to='/feed/profile' className='mr-5 text-sm font-bold hover:underline'>Profile</NavLink>
            <NavLink to='/feed/settings' className='mr-5 text-sm font-bold hover:underline'>Settings</NavLink>
        </div >
    )
}

export default Navbar