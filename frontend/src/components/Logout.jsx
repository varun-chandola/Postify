import React from 'react'
import Navbar from './Navbar'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import axios from 'axios'

const Logout = () => {
    const navigate = useNavigate()
    const logoutUser = async () => {
        try {
            const response = await axios.post("http://localhost:5000/api/v1/user/logout", {}, { withCredentials: true })
            console.log(response?.data)
            toast.success(response?.data?.msg)
            if(response?.data?.msg)
                navigate('/')
        } catch (error) {
            toast.error(error?.response?.data?.msg)
        }
    }
    return (
        <>
            <Navbar />
            <div className='flex items-center justify-center h-[100vh]'>
                <div className='flex flex-col'>
                    <h1 className='text-5xl font-bold w-[80vw] flex items-center justify-center' >Are You Sure ? </h1>
                    <div className='flex justify-between mt-20'>
                        <button className='text-5xl font-bold text-white bg-green-700 rounded-3xl p-5 w-1/3 hover:bg-green-900' onClick={logoutUser}>Yes</button>
                        <button className='text-5xl font-bold text-white bg-red-700 rounded-3xl p-5 w-1/3 hover:bg-red-900'
                            onClick={() => navigate('/blogs/all')}
                        >No</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Logout