import { createContext, useContext, useEffect, useState } from "react";
import { 
    createUserWithEmailAndPassword, 
    signInWithPopup, 
    GoogleAuthProvider, 
    onAuthStateChanged,
    signOut
} from 'firebase/auth'
import { auth, getUserInfo, registerNewUser, userExists } from '../db/firebase';
import { useNavigate } from "react-router";


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
    //const [isRegistered, setIsRegistered] = useState(false);
	const [userInfo, setUserInfo] = useState({});
    const navigate = useNavigate();


    const signUp = (email, password) => createUserWithEmailAndPassword(auth, email, password);

    const logout = () => {
        signOut(auth);
    };

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
        return () => onSubscribe()
 	}, []);


	const logInWithGoogle = async () => {
        const googleProvider = new GoogleAuthProvider();
        return await signInWithPopup(auth, googleProvider)
    }
    return <AuthContext.Provider value={ { user, signUp, logInWithGoogle, logout, loading, userInfo  } }>
        {children}
    </AuthContext.Provider>
}