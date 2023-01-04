import { faBook } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'
import { useAuth } from '../../context/AuthContext'
import './HomeWrapper.scss';

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
        <header className='header'>
            <div className='header__logo'>
				<FontAwesomeIcon icon={faBook} className='header__logo-icon'/>
				<h1 className='header__logo-h1'>Registro de turnos</h1>
			</div>
			<button className='header__btn-cerrarsesion' onClick={handleLogout}>Cerrar sesión</button>
        </header>
        <div>
            { children }
        </div>
    </div>

  )
}

export default HomeWrapper