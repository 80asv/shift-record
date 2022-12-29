import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { auth, registerNewUser, userExists } from '../../db/firebase';
import { useNavigate } from 'react-router';

const AuthProvider = ({ children, onUserLoggedIn, onUserNotLoggedIn, onUserNotRegistered }) => {

    const navigate = useNavigate();

    useEffect(() => { // detectar si ya esta autenticado o no
		//setCurrentState(1)
		onAuthStateChanged(auth, handleUserStateChanged);
	}, [navigate, onUserLoggedIn, onUserNotLoggedIn, onUserNotRegistered])

    const handleUserStateChanged = async (user) => {
		if(user){
			const isRegistered = await userExists(user.uid);
			if(isRegistered){
				// navigate('/dashboard');
				// setCurrentState(2);
                onUserLoggedIn(user);
			} else {
				// navigate('/choose-username');
				// setCurrentState(3);
                await registerNewUser({
                    uid: user.uid,
                    displayName: user.displayName,
                    username: '',
                    processCompleted: false
                });
                onUserNotRegistered(user);
			}
		} else {
			// setCurrentState(4)
			// console.log('no hay nadie autenticado')
            onUserNotLoggedIn(user)
		}
	}

    return (
        <div>
            {children}
        </div>
    )
}

export default AuthProvider