import { faArrowRightFromBracket, faBook } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'
import { useAuth } from '../../context/AuthContext'
import { useResize } from '../../hooks/useResize';
import Footer from '../Footer/Footer';
import './HomeWrapper.scss';

const HomeWrapper = ({ children }) => {

    const { logout } = useAuth();
	const { width } = useResize();

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
			<button className='header__btn-cerrarsesion' onClick={handleLogout}>
				{(width >= 660) ? 'Cerrar sesión' : <FontAwesomeIcon icon={faArrowRightFromBracket}/> }
			</button>
        </header>
        <div>{ children }</div>
        <Footer/>
    </div>

  )
}

export default HomeWrapper