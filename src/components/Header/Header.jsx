import { faArrowRightFromBracket, faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Header.scss";

const Header = () => {

	const { user, logout } = useAuth();

	const handleLogout = async () => {
        try {
          await logout();
		  localStorage.removeItem('turns');
		  localStorage.removeItem('dateFilter');
		  localStorage.removeItem('placeFilter');
        } catch (error) {
          console.log(error);
        }
    }

	return (
		<header className="header">
			<div className="header__greet">
				<h2 className="header__greet-name">Hola, {user.displayName ?  user.displayName.split(' ')[0] : 'user'}</h2>
			</div>
			<div className="header__buttons">
				{/* <Link to='/dashboard/settings' className="header__buttons-btn header__buttons-settings">
					<FontAwesomeIcon className="header__buttons-btn-icon" icon={faGear}></FontAwesomeIcon>
				</Link> */}
				<button className="header__buttons-btn header__buttons-logout" onClick={handleLogout}>
					<FontAwesomeIcon className="header__buttons-btn-icon" icon={faArrowRightFromBracket}/>
				</button>
			</div>
		</header>
	);
};

export default Header;
