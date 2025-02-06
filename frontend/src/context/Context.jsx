import React, { createContext, useEffect, useState } from 'react'
import axios from "axios"

export const AuthContext = createContext()
const Context = ({ children }) => {
    const [userCollections, setUserCollections] = useState([])

    const getUserCollections = async () => {
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/v1/user/feed/yourCollections`, {
            withCredentials: true
        })
        setUserCollections(response.data?.userCollections)
    }

    useEffect(() => {
        getUserCollections()
    }, [])

    return (
        <AuthContext.Provider value={{ userCollections, setUserCollections, getUserCollections }}>
            {children}
        </AuthContext.Provider>
    )
}

export default Context