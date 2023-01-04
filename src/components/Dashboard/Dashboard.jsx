import { faBook } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { deleteTurn, getTurns, updateTurn } from '../../db/firebase'
import HomeWrapper from '../HomeWrapper/HomeWrapper'
import Loader from '../Loader/Loader'
import SelectList from '../SelectList/SelectList'
import Turn from '../Turn/Turn'
import './Dashboard.scss'

/**
 * TODO: Sistema de filtro
 * TODO: Clipboard
 * TODO: Componente loading
 * TODO: Formateo de horas
 * TODO: Añadir mas informacion de registro de turnos (fecha y hora de registro)
 * 
 * TODO: revisar marcas de tiempo
 * TODO: calcular precio de turnos
 */

const Dashboard = () => {
	const { user } = useAuth();
	const [turns, setTurns] = useState([]);
	const [loading, setLoading] = useState(true);
	const [isFilteredByPlace, setIsFilteredByPlace] = useState(false);
	const [isFiltereByDateTurn, setIsFiltereByDateTurn] = useState(false);

	const [place, setPlace] = useState("");
	const [date, setDate] = useState('');

	const [listPlaces, setListPlaces] = useState([]);
	const [listDates, setListDates] = useState([]);
	const [collecredThisMounth, setCollecredThisMounth] = useState(0);

	useEffect(() => {
		const getTurnsList = async () => {
			const res = await getTurns(user.uid);

			/* Listas */
			setListPlaces(() => { // listar lugares
				const places = res.map((turn) => turn.placeToShift);
				return [...new Set(places)]; // eliminar los repetidos
			})

			setListDates(() => { // listar fechas
				const dates = res.map(turn => turn.dateTurn);
				return [...new Set(dates)];
			})

			// TODO: PENDIENTE
			setCollecredThisMounth(()=> {
				const dates = res.map(turn => turn.dateTurn);
				console.log(dates);
				return dates;
			})

			/* Filtros */
			if(isFilteredByPlace){ // filtro por lugares
				setTurns(() => {
					const placesFiltered = res.filter((turn) => turn.placeToShift === place);
					return placesFiltered;
				});
			} else if(isFiltereByDateTurn){ // filtro por fechas
				setTurns(() => {
					const datesFiltered = res.filter((turn) => turn.dateTurn === date);
					return datesFiltered
				});
			} else {
				setTurns(res); // sin filtros
			}
			console.log(res)
			setLoading(false);
		}
		getTurnsList();
	}, [date , isFiltereByDateTurn, isFilteredByPlace, place, user.uid, user]); // TODO: REVISAR SI SE ESTA CICLANDO

	const handleDeleteTurn = async (docId) => {
		await deleteTurn(docId);
		const tmp = turns.filter(turn => turn.docId !== docId);
		setTurns([...tmp]);
	};

	const handleEditTurn = async (docId, turnEdited) => {
		let turn = turns.find(turn => turn.docId === docId);
		turn = {...turn, ...turnEdited };
		await updateTurn(docId, turn);
	}

	const handleChangeFilterByPlace = (e) => {
		setPlace(e.target.value);
		if(e.target.value !== ""){
			setIsFilteredByPlace(true);
		} else {
			setIsFilteredByPlace(false);
		}
	}

	const handleChangeFilterByDate = (e) => {
		setDate(e.target.value);
		if(e.target.value !== ''){
			setIsFiltereByDateTurn(true)
		} else {
			setIsFiltereByDateTurn(false)
		}
	}

  	return (
		<HomeWrapper>
			<div className='dashboard__header'>
				<h2><p className='dashboard__header-saludo'>Bienvenid@</p>{user.displayName}</h2>
				<div className="card">
					<div className='card__info'>
						<p className='card__info-title'>Total recogido este mes</p>
						<p className='card__info-money'>$106.000 COP</p>
						<p className='card__info-label'>suma total de cada precio de los turnos</p>
					</div>
					<button className='card__btn'>
						<FontAwesomeIcon icon={faBook} className='card__btn-icon'/>
						<p className='card__btn-label'>Copiar turnos visibles</p>
					</button>
				</div>
			</div>
			<main className='main'>
				<h3 className='main__misturnos'>Mis turnos</h3>
				<div className='main__btns'>
					<Link to='/dashboard/agregar-turno' className='main__btns-agregarturno'>
						<FontAwesomeIcon icon={faBook}/>
						<p>Nuevo turno</p>
					</Link>
					<div className='main__btns-filters'>
						<SelectList className='main__btns-filters-place main__btns-filters-btn' id='placeToShift' title='lugares' handleChange={handleChangeFilterByPlace} data={listPlaces}/>
						<SelectList className='main__btns-filters-date main__btns-filters-btn' id='dateTurn' title='fechas' handleChange={handleChangeFilterByDate} data={listDates}/>
					</div>
				</div>
				<div className="main__turns">
					{
						turns.map((turn) => <Turn
							key={turn.id}
							timeStamp={turn.timeStamp}
							id={turn.id}
							docId={turn.docId}
							placeToShift={turn.placeToShift} 
							dateTurn={turn.dateTurn} 
							admissionTime={turn.admissionTime} 
							departureTime={turn.departureTime}
							onDelete={handleDeleteTurn}
							onEdit={handleEditTurn}
						/>)
					}
				</div>
			</main>
			{loading && <Loader/>}
		</HomeWrapper>
	)
}

export default Dashboard