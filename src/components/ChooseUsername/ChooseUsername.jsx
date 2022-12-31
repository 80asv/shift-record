import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { existUserName, getUserInfo, registerNewUser, updateUser, userExists } from '../../db/firebase';


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
		<div>
			<h1>Bienvenido {user.displayName}</h1>
			<p>Elige un nombre de usuario</p>
			<div>
			<input type="text" name="username" id="username" onInput={handleUserName}/>
			</div>
			<div>
			<button onClick={handleContinue}>Continuar</button>
			<button onClick={handleLogout}>Cerrar sesion</button>
			</div>
		</div>
	)
	

}

export default ChooseUsername