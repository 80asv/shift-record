import { faArrowRightFromBracket, faBook } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useResize } from '../../hooks/useResize';
import DownloadAppBtn from '../DownloadAppBtn/DownloadAppBtn';
import Footer from '../Footer/Footer';
import './HomeWrapper.scss';

const HomeWrapper = ({ children }) => {

    const { logout } = useAuth();
	const { width } = useResize();

	const [isReadyForInstall, setIsReadyForInstall] = React.useState(false);

	useEffect(() => {
		window.addEventListener("beforeinstallprompt", (event) => {
			// Prevent the mini-infobar from appearing on mobile.
			event.preventDefault();
			// Stash the event so it can be triggered later.
			window.deferredPrompt = event;
			// Remove the 'hidden' class from the install button container.
			setIsReadyForInstall(true);
		});
	}, []);

	async function downloadApp() {
		const promptEvent = window.deferredPrompt;
		if (!promptEvent) {
			// The deferred prompt isn't available.
			return;
		}
		// Show the install prompt.
		promptEvent.prompt();
		// Log the result
		const result = await promptEvent.userChoice;
		// Reset the deferred prompt variable, since
		// prompt() can only be called once.
		window.deferredPrompt = null;
		// Hide the install button.
		setIsReadyForInstall(false);
	}


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
			
			<div className='header__btns'>
				{isReadyForInstall && <DownloadAppBtn handleClick={downloadApp}/>}	
				<button className='header__btn-cerrarsesion' onClick={handleLogout}>
					{(width >= 660) ? 'Cerrar sesión' : <FontAwesomeIcon icon={faArrowRightFromBracket}/> }
				</button>
			</div>
        </header>
        <div>{ children }</div>
        <Footer/>
    </div>

  )
}

export default HomeWrapper