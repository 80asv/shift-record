import React from 'react'
import { Navigate } from 'react-router';
import { useAuth } from '../../context/AuthContext'

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if(loading) return <div style={{visibility: 'hidden'}}>...</div>
    if(!user) return <Navigate to='/login'/>
    return <>{children}</>   
}

export default ProtectedRoute