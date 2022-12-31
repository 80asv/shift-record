import React, { useState } from 'react'
import { useNavigate } from 'react-router';
import { AuthContext, useAuth } from '../../context/AuthContext'

const Register = () => {

	// context
	const { signUp } = useAuth(AuthContext);

	const navigate = useNavigate();

	const [user, setUser] = useState({
		email: '',
		password: ''
	})

	const handleChange = ({target: { name, value }}) => {
		setUser({...user, [name]: value })
	}

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			await signUp(user.email, user.password);
			navigate('/');
		} catch (error) {
			
		}

	}

	return (
		<form onSubmit={handleSubmit}>
		<label htmlFor="email">Email</label>
		<input type="email" name="email" id="email" onChange={handleChange}/>

		<label htmlFor="password">Password</label>
		<input type="password" name="password" id="password" onChange={handleChange}/>
		
		<button>Registrarme</button>
		</form>
	)
}

export default Register