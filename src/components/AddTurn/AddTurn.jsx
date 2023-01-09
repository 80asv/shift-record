import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import HomeWrapper from '../HomeWrapper/HomeWrapper'
import { v4 as uuidv4 } from 'uuid';
import { insertNewTurn } from '../../db/firebase';
import { toast, Toaster } from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import { motion } from 'framer-motion'
import 'moment/locale/es';
import RadioBtn from '../RadioBtn/RadioBtn';
import './AddTurn.scss';

const initialForm = {
	placeToShift: '',
	dateTurn: '',
	admissionTime: '',
	departureTime: '',
	typeShift: '',
}

const AddTurn = () => {

	moment.locale('es');

	const { user } = useAuth();
	const [turn, setTurn] = useState(initialForm);
	const [workingHours, setWorkingHours] = useState(0);
	const [priceShift, setPriceShift] = useState(0);

	useEffect(() => {
		setWorkingHours(() => {
			let date1 = moment(turn.admissionTime, 'hh:mm A');
			let date2 = moment(turn.departureTime, 'hh:mm A');
			return (date1.diff(date2, 'hours') * (-1));
		})
		setPriceShift(() => {
			const NORMAL = 34573;
			const MEDIUM = 23073;
			const FESTIVE = 51823;

			if(turn.admissionTime === '' || turn.departureTime === ''){
				return 0;
			} else {
				let priceHour = 0;
				switch (turn.typeShift) {
					case 'normal': priceHour = (NORMAL/8); break;
					case 'medio': priceHour = (MEDIUM/4); break;
					case 'festivo': priceHour = (FESTIVE/8); break;
					case '': return 0;
					default: return 0;
				}
				return (priceHour*workingHours);
			}
		})
	}, [turn.admissionTime, turn.departureTime, turn.typeShift, workingHours])
	
	
	const handleChange = ({ target: { name, value } }) => {
		setTurn({ ...turn, [name]: value, uid: user.uid })
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
		const res = insertNewTurn({
			...turn,  
			id: uuidv4(),
			timeStamp: today,
			priceShift: priceShift,
			workingHours: workingHours
		});
		setTurn({ ...turn, docList: res.id });
		setTurn(initialForm);
	}

	return (
		<HomeWrapper>
			
			<motion.div 
				className='form'
				transition={{ duration: .4, ease: 'easeOut'}}
				initial={{opacity: 0, y: 100}}
				animate={{opacity: 1, y: 1}}
			>
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
							<div className='form__card-inputs-type-shift'>
								<label>Horario de turno</label>
								<div className='form__card-inputs-type-shift-radiobtn'>
									<RadioBtn name='typeShift' title='completo' handleChange={handleChange} value='normal'/>
									<RadioBtn name='typeShift' title='medio' handleChange={handleChange} value='medio'/>
									<RadioBtn name='typeShift' title='festivo' handleChange={handleChange} value='festivo'/>
								</div>
							</div>
							
						</div>
						<div className='form__card-footer'>
							<div className='form__card-footer-info'>
								<p className='form__card-footer-info-priceshift'>Valor del turno: ${priceShift.toLocaleString('co-CO', {maximumFractionDigits: 1})} COP</p>
								<div className='form__card-footer-info-message'>
									<FontAwesomeIcon icon={faCircleExclamation} className='icon'/>
									<p className='message'>Tenga en cuenta que el valor del turno es un estimado y puede no ser exacto al valor final de su nomina.</p>
								</div>
							</div>
							<div className='form__card-footer-btns'>
								<input type="submit" value="Registrar" className='btn-registrar'/>
								<Link to='/dashboard' className='btn-volver'>Volver</Link>
							</div>
						</div>
					</div>
				</form>
			</motion.div>
			<Toaster/>
		</HomeWrapper>
	)
}

export default AddTurn