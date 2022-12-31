// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getFirestore, collection, addDoc, doc, getDoc, query, where, setDoc, deleteDoc, getDocs } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, getBytes } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);


// esta funcion se ecarga de buscar si un usuario ya esta dentro de la base de datos o no
export async function userExists(uid){
	const docRef = doc(db, 'users', uid); // referencia de busqueda
	const res = await getDoc(docRef); //obtenemos la informacion de la busqueda
	return res.exists();
}

export async function existUserName(username){
	const users = [];
	const docsRef = collection(db, 'users')
	const q = query(docsRef, where('username', '==', username));

	const querySnapshot = await getDocs(q);

	querySnapshot.forEach(doc => {
		users.push(doc.data());
	});

	return users.length > 0 ? users[0].uid : null;
}

export async function registerNewUser(user){
	try {
		const collectionRef = collection(db, 'users');
		const docRef = doc(collectionRef, user.uid);
		await setDoc(docRef, user);
	} catch (error) {}
}

export async function updateUser(user){
	try {
		const collectionRef = collection(db, 'users');
		const docRef = doc(collectionRef, user.uid);
		await setDoc(docRef, user);
	} catch (error) {
		
	}
}

export async function getUserInfo(uid){
	try {
		const docRef = doc(db, 'users', uid);
		const document = await getDoc(docRef);
		return document.data();
	} catch (error) {}
}