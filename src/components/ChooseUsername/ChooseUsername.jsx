import React, { useState } from 'react'
import { useNavigate } from 'react-router';
import { existUserName, updateUser } from '../../db/firebase';
import AuthProvider from '../AuthProvider/AuthProvider'

const ChooseUsername = () => {

	const [state, setState] = useState(0);
	const [currentUser, setCurrentUser] = useState({});
	const [username, setUsername] = useState("");
	
	const navigate = useNavigate();

	const handleUserLoggedIn = (user) => {
			navigate('/dashboard')
		}
		const handleonUserNotRegistered = (user) => {
		setCurrentUser(user);
			setState(3);
		}
		const handleonUserNotLoggedIn = () => {
			navigate('/login');
		}

	const handleContinue = async (e) => {
		if(username !== ''){
		const exist = await existUserName(username);
		if(exist){
			setState(5);
		} else {
			const tmp = {...currentUser};
			tmp.username = username;
			tmp.processCompleted = true;
			await updateUser(tmp);
		}
		}
	};

	const handleUserName =  (e) => setUsername(e.target.value);

	if(state === 3){
		return(
		<div>
			<h1>Bienvenido {currentUser.displayName}</h1>
			<p>Elige un nombre de usuario</p>
			<div>
			<input type="text" name="username" id="username" onInput={handleUserName}/>
			</div>
			<div>
			<button onClick={handleContinue}>Continuar</button>
			</div>
		</div>
		)
	}
  
	return (
		<AuthProvider
		onUserLoggedIn={handleUserLoggedIn} 
				onUserNotRegistered={handleonUserNotRegistered} 
				onUserNotLoggedIn={handleonUserNotLoggedIn}
		>

		</AuthProvider>
	)
}

export default ChooseUsername