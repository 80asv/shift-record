import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import HomeWrapper from '../HomeWrapper/HomeWrapper'
import { v4 as uuidv4 } from 'uuid';
import { insertNewTurn } from '../../db/firebase';
import { toast, Toaster } from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import './AddTurn.scss';
import moment from 'moment';
import 'moment/locale/es';

const initialForm = {
	placeToShift: '',
	dateTurn: '',
	admissionTime: '',
	departureTime: '',
}

const AddTurn = () => {

	moment.locale('es');

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
		let today = moment().format('MMMM Do YYYY, h:mm:ss a');
		const res = insertNewTurn({...turn,  timeStamp: today });
		setTurn({ ...turn, docList: res.id });
		setTurnList([...turnList, turn]);
		setTurn(initialForm);
	}

	return (
		<HomeWrapper>
			<div className='form'>
				<form className='form__card' onSubmit={handleSubmit}>
					<h2 className='form__card-title'>Registrar turno</h2>
					<div className='form__card-container'>
						<div className='form__card-inputs'>
							<div className='form__card-inputs-place'>
								<label htmlFor="placeToShift">Lugar del turno</label>
								<input type="text" name="placeToShift" id="placeToShift" onChange={handleChange} value={turn.placeToShift}/>
							</div>
							<div className='form__card-inputs-date'>
								<label htmlFor="dateTurn">Dia de Inicio</label>
								<input type="date" name="dateTurn" id="dateTurn" onChange={handleChange} value={turn.dateTurn}/>
							</div>
							<div className='form__card-inputs-hours'>
								<div className='form__card-inputs-hours-admissiontime'>
									<label htmlFor="admissionTime">Hora de ingreso</label>
									<input type="time" name="admissionTime" id="admissionTime" onChange={handleChange} value={turn.admissionTime}/>
								</div>
								<div className='form__card-inputs-hours-departuretime'>
									<label htmlFor="departureTime">Hora de salida</label>
									<input type="time" name="departureTime" id="departureTime" onChange={handleChange} value={turn.departureTime}/>
								</div>
							</div>
						</div>
						<div className='form__card-footer'>
								<div className='form__card-footer-info'>
									<p className='form__card-footer-info-priceturn'>Valor del turno: </p>
									<div className='form__card-footer-info-message'>
										<FontAwesomeIcon icon={faCircleExclamation} className='icon'/>
										<p className='message'>tenga en cuenta que el valor del turno es un estimado y puede no ser exacto al valor final de su nomina.</p>
									</div>
								</div>
								<div className='form__card-footer-btns'>
									<input type="submit" value="Registrar" className='btn-registrar'/>
									<Link to='/dashboard' className='btn-volver'>Volver</Link>
								</div>
							</div>
					</div>
				</form>
			</div>
			<Toaster/>
		</HomeWrapper>
	)
}

export default AddTurn