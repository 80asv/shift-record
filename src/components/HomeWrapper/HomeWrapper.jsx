import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const HomeWrapper = ({ children }) => {

    const { logout } = useAuth();

    const handleLogout = async () => {
        try {
          await logout();
        } catch (error) {
          console.log(error)
        }
    }

  return (
    <div>
        <nav>
            <div>Logotipo</div>
            <button onClick={handleLogout}>Logout</button>
        </nav>
        <div>
            { children }
        </div>
    </div>

  )
}

export default HomeWrapper