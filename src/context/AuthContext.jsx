import { createContext, useContext, useEffect, useState } from "react";
import { 
    createUserWithEmailAndPassword, 
    signInWithPopup, 
    GoogleAuthProvider, 
    onAuthStateChanged,
    signOut
} from 'firebase/auth'
import { getToken } from "firebase/messaging";
import { auth, getUserInfo, registerNewUser, userExists, messaging } from '../db/firebase';
import { useNavigate } from "react-router";
import 'react-toastify/dist/ReactToastify.css';


export const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context) throw new Error('There is no auth provider');
    return context
}

export function AuthProvider({ children }){
    // state
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
	const [userInfo, setUserInfo] = useState({});
    const navigate = useNavigate();

    const signUp = (email, password) => createUserWithEmailAndPassword(auth, email, password);

    const logout = () => signOut(auth);

    const enableNotifications = async () => {
        try {
            const token = await getToken(
                messaging,
                { vapidKey: 'BKBygwpLcuKdHnmVCiTRPf89carHYn3Zz7w1ZCnj873Is2YRofY5otJ4niew338Jtl_oP_D2hm5FMDy3n2W0rNk' }
            ).catch( error => console.log('hubo un error al generar el token', error));
            return token
        } catch (error) { console.log('ocurrio un error al generar el token') }
    }

    const logInWithGoogle = async () => {
        const googleProvider = new GoogleAuthProvider();
        return await signInWithPopup(auth, googleProvider)
    }


    useEffect(() => { // detectar si ya esta autenticado o no
        const onSubscribe = onAuthStateChanged(auth, async (currentUser) => {
            try {
                setUser(currentUser);
                setLoading(false);
                let isRegistered = await userExists(currentUser.uid);
                if(isRegistered){
                    navigate('/dashboard');
                } else {
                    await registerNewUser({
                        uid: currentUser.uid,
                        displayName: currentUser.displayName,
                        username: '',
                        processCompleted: false
                    })
                    setUserInfo(await getUserInfo(currentUser.uid));
                    navigate('/choose-username');
                }
            } catch (error) { console.error(error) }
        });
        return () => onSubscribe();
 	}, []);

    return(
        <AuthContext.Provider value={ { user, signUp, logInWithGoogle, logout, loading, userInfo, enableNotifications  } }>
            {children}
        </AuthContext.Provider>  
    ) 
}