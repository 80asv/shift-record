import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { existUserName, getUserInfo, registerNewUser, updateUser, userExists } from '../../db/firebase';
import AnimatedBg from '../AnimatedBg/AnimatedBg';
import './ChooseUsername.scss'


const ChooseUsername = () => {

	const { user, logout, userInfo } = useAuth();
	const [username, setUsername] = useState("");
	const navigate = useNavigate();
	
	const handleContinue = async (e) => {
		if(username !== ''){
			const exist = await existUserName(username);
			if(exist){
				console.log('este nombre de usuario ya existe');
			} else {
				const tmp = {...userInfo };
				tmp.username = username;
				tmp.processCompleted = true;
				await updateUser(tmp);
				console.log('usuario registrado con exito');
				console.log({ userInfo, tmp });
				navigate('/dashboard');
			}
		}
	};

	const handleLogout = async () => {
        try {
          await logout();
        } catch (error) {
          console.log(error);
        }
    }

	const handleUserName =  (e) => setUsername(e.target.value);

	return(
		<div className='choose-username'>
			<div className='choose-username__container'>
				<div className='choose-username__header'>
					<div className='choose-username__header-welcome'>
						<h2 className='choose-username__header-title'>Hola {user.displayName.substring(0, user.displayName.indexOf(" "))}!</h2>
						<p className='choose-username__header-label'>Ya estas a un paso de terminar. Para finalizar ingresa un nombre de usuario.</p>
					</div>
					<input className='choose-username__header-input' type="text" name="username" id="username" onInput={handleUserName}/>
				</div>
				<div className='choose-username__btns'>
					<button className='choose-username__btns-btn continue' onClick={handleContinue}>Continuar</button>
					<button className='choose-username__btns-btn logout' onClick={handleLogout}>Cerrar sesion</button>
				</div>
			</div>
		</div>
	)
	

}

export default ChooseUsername