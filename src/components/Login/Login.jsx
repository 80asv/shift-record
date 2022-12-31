import { Navigate, useNavigate } from "react-router";
import { AuthContext, useAuth } from "../../context/AuthContext";
import { registerNewUser, userExists } from "../../db/firebase";

const Login = () => {
	
	const navigate = useNavigate();
	// context
	const { logInWithGoogle, user } = useAuth();

	if(user) return <Navigate to='/'/>

	const handleGoogleLogIn = async () => {
		try {
			await logInWithGoogle();
		} catch (error) { console.log(error); }
	}

	return (
		<div>
			<button onClick={handleGoogleLogIn}>Ingresar con Google</button>
		</div>
	)
}

export default Login



























// const Login = () => {
// 	const navigate = useNavigate();
// 	/**
// 	 * 0: inicializado
// 	 * 1: loading
// 	 * 2: login completo
// 	 * 3: login pero sin registro
// 	 * 4: no hay nadie logeado
// 	 * 5: ya existe el nombre de usuario
// 	 */
// 	const [currentState, setCurrentState] = useState(0);


// 	useEffect(() => { // detectar si ya esta autenticado o no
// 		setCurrentState(1)
// 		onAuthStateChanged(auth, handleUserStateChanged);
// 	}, [navigate]);
	
// 	const handleUserStateChanged = async (user) => {
// 		if(user){
// 			const isRegistered = await userExists(user.uid);
// 			if(isRegistered){
// 				navigate('/dashboard');
// 				setCurrentState(2);
// 			} else {
// 				navigate('/choose-username');
// 				setCurrentState(3);
// 			}
// 		} else {
// 			setCurrentState(4)
// 			console.log('no hay nadie autenticado')
// 		}
// 	}

// 	const handleClick = async () => {
// 		const googleProvider = new GoogleAuthProvider();
// 		await signinWithGoogle(googleProvider);
// 	}

// 	// const signinWithGoogle = async (googleProvider) => {
// 	// 	try {
// 	// 		const res = await signInWithPopup(auth, googleProvider);
// 	// 		console.log(res);
// 	// 	} catch (err) {
// 	// 		console.log(err);
// 	// 	}
// 	// }

// 	// const handleUserLoggedIn = (user) => {
// 	// 	navigate('/dashboard')
// 	// }
// 	// const handleonUserNotRegistered = (user) => {
// 	// 	navigate('/choose-username')
// 	// }
// 	// const handleonUserNotLoggedIn = () => {
// 	// 	setCurrentState(4)
// 	// }

// 	if(currentState === 4){
// 		return (
// 			<div>
// 				<button onClick={handleClick}>Login with Google</button>
// 			</div>
// 		)
// 	}
	
// 	return(
// 		// <AuthProvider
// 		// 	onUserLoggedIn={handleUserLoggedIn} 
// 		// 	onUserNotRegistered={handleonUserNotRegistered} 
// 		// 	onUserNotLoggedIn={handleonUserNotLoggedIn}
// 		// >
// 			<div>loading...</div>
// 		// </AuthProvider>
// 	)
// }

