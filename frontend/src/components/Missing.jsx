import React from 'react'
import Navbar from './Navbar'

const Missing = () => {
    return (
        <>
            <Navbar />
            <div className='bg-gray-900 h-[100vh] flex justify-center items-center'>
                <div className='text-white font-bold text-6xl'>
                    <h1>404 | This page could not be found.</h1>
                </div>
            </div>
        </>
    )
}

export default Missing