import { async } from "@firebase/util";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Navigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import AnimatedBg from "../AnimatedBg/AnimatedBg";
import "./Login.scss";

const Login = () => {
	//state
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	// context
	const { logInWithGoogle, user, signUp } = useAuth();
	if (user) return <Navigate to="/" />;

	const handleChangeEmail = (e) => setEmail(e.target.value);
	const handleChangePassword = (e) => setPassword(e.target.value);
	
	const handleSubmit = async (e) => {
		try {
			e.preventDefault()
			await signUp(email, password);
		} catch (error) {
			console.log(error)
		}
	}

	const handleGoogleLogIn = async () => {
		try {
			await logInWithGoogle();
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<section className="login__bg">
			<div className="login">
				<div className="login__cnt">
					<h1 className="login__cnt-title">Regitur</h1>
					<p>Registre, guarde y tenga control de lo que gana con cada turno laboral que realiza</p>
					{/* <form className="login__cnt-form" onSubmit={handleSubmit}>
						<div className="login__cnt-form-inputs">
							<input type="email" name="email" id="email" placeholder="Correo Electrónico" onChange={handleChangeEmail}/>
							<input type="password" name="password" id="password" placeholder="Contraseña" onChange={handleChangePassword}/>
							<a href="#">Recordar contraseña</a>
						</div>
						<input className="login__cnt-form-btn" type="submit" value="Ingresar" />
					</form> */}
					<span className="login__cnt-acounts">Continuar con</span>
					<button onClick={handleGoogleLogIn} className='login__cnt-acounts-btn'>
						<img src="/google-icon.svg" alt="Google" />
					</button>
				</div>
			</div>
		</section>
	);
};

export default Login;
