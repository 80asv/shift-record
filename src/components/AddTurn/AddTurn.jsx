import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import HomeWrapper from '../HomeWrapper/HomeWrapper'
import { v4 as uuidv4 } from 'uuid';
import { insertNewTurn } from '../../db/firebase';

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

	const handleSubmit = (e) => {
		e.preventDefault();
		addTurn();
	}

	const addTurn = () => {
		const res = insertNewTurn(turn);
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
				<input type="text" name="placeToShift" id="placeToShift" onChange={handleChange}/>
				<label htmlFor="dateTurn">Dia de Inicio</label>
				<input type="date" name="dateTurn" id="dateTurn" onChange={handleChange}/>
				<label htmlFor="admissionTime">Hora de ingreso</label>
				<input type="time" name="admissionTime" id="admissionTime" onChange={handleChange}/>
				<label htmlFor="departureTime">Hora de salida</label>
				<input type="time" name="departureTime" id="departureTime" onChange={handleChange}/>
				<input type="submit" value="Agregar" />
			</form>
		</HomeWrapper>
	)
}

export default AddTurn