import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import HomeWrapper from '../HomeWrapper/HomeWrapper'
import { v4 as uuidv4 } from 'uuid';
import { insertNewTurn } from '../../db/firebase';
import { toast, Toaster } from 'react-hot-toast';

const initialForm = {
	placeToShift: '',
	dateTurn: '',
	admissionTime: '',
	departureTime: '',
}

const AddTurn = () => {

	const { user } = useAuth();
	const [turn, setTurn] = useState(initialForm);
	const [turnList, setTurnList] = useState([]);
	
	const handleChange = ({ target: { name, value } }) => {
		setTurn({ ...turn, [name]: value, uid: user.uid, id: uuidv4() })
	}

	const containsEmptyValues = (obj) => {
		for (const value of Object.values(obj)) {
			if (value == null || value === '' || (Array.isArray(value) && value.length === 0) || (typeof value === 'object' && Object.keys(value).length === 0)) {
				return true;
			}
		}
		return false;
	}

	const handleSubmit = (e) => {
		e.preventDefault();
		try {
			if(containsEmptyValues(turn)){
				toast.error('Rellena todos los campos');
				return;
			} else {
				addTurn();
				toast('Turno Registrado con Exito', {
					icon: '🎉',
				});
			}
		} catch (error) {
			toast.error('Ha ocurrido un error, vuelve a intentarlo')
		}
	}

	const addTurn = () => {
		let today = new Date().toLocaleDateString();
		const res = insertNewTurn({...turn,  timeStamp: today });
		setTurn({ ...turn, docList: res.id });
		setTurnList([...turnList, turn]);
		setTurn(initialForm);
	}

	return (
		<HomeWrapper>
			<h2>Agregar nuevo turno</h2>
			<form onSubmit={handleSubmit}>
				<Link to='/dashboard'>Volver</Link>
				<label htmlFor="placeToShift">Lugar del turno</label>
				<input type="text" name="placeToShift" id="placeToShift" onChange={handleChange} value={turn.placeToShift}/>
				<label htmlFor="dateTurn">Dia de Inicio</label>
				<input type="date" name="dateTurn" id="dateTurn" onChange={handleChange} value={turn.dateTurn}/>
				<label htmlFor="admissionTime">Hora de ingreso</label>
				<input type="time" name="admissionTime" id="admissionTime" onChange={handleChange} value={turn.admissionTime}/>
				<label htmlFor="departureTime">Hora de salida</label>
				<input type="time" name="departureTime" id="departureTime" onChange={handleChange} value={turn.departureTime}/>
				<input type="submit" value="Agregar" />
			</form>
			<Toaster/>
		</HomeWrapper>
	)
}

export default AddTurn