import React from 'react'
import { NavLink } from 'react-router-dom'

const Navbar = () => {
    return (
        <div className='flex justify-end bg-yellow-50 p-5 text-xl mt-0 w-full'>
            <NavLink to='/blogs/all' className='mr-5 hover:underline font-bold'>Recent</NavLink>
            <NavLink to='/feed/popular' className='mr-5 hover:underline font-bold'>Popular</NavLink>
            <NavLink to='/blog/create' className='mr-5 hover:underline font-bold'>Create</NavLink>
            <NavLink to='/feed/profile' className='mr-5 hover:underline font-bold'>Profile</NavLink>
            <NavLink to='/feed/logout' className='mr-5 hover:underline font-bold'>Logout</NavLink>
        </div>
    )
}

export default Navbar