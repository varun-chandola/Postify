import React, { useState } from 'react'
import Navbar from './Navbar'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import axios from 'axios'

const Logout = () => {
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const logoutUser = async () => {
        try {
            setLoading(true)
            const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/v1/user/logout`, {}, { withCredentials: true })
            toast.success(response?.data?.msg)
            if (response?.data?.msg == 'Logged Out') {
                navigate('/')
                localStorage.removeItem('loggedInUser')
            }
            setLoading(false)
        } catch (error) {
            if (error.response?.data?.msg == `unauthorized`) {
                toast.error(error.response?.data?.msg)
                navigate('/login')
            }
        }
    }

    return (
        <>
            <Navbar />
            <div className='h-screen'>
                <button className="btn flex text-xl font-bold mt-5 mx-auto" onClick={() => document.getElementById('my_modal_5').showModal()}>Log Out</button>
                <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Want to Logout !</h3>
                        <p className="py-4">Are You Sure ?</p>
                        <div className="modal-action">
                            <form method="dialog">
                                <button className='btn mx-3' onClick={logoutUser}>
                                    {`${loading ? <span class="loading loading-spinner loading-sm"></span> : `Yes`}`}
                                </button>
                                <button className="btn mx-4" onClick={() => navigate('/blogs/all')}>No</button>
                            </form>
                        </div>
                    </div>
                </dialog>
                <button className="btn flex text-xl font-bold mt-5 mx-auto">Update Details</button>
            </div>
        </>
    )
}

export default Logout