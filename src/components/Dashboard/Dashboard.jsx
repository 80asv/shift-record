import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { deleteTurn, getTurns, updateTurn } from '../../db/firebase'
import HomeWrapper from '../HomeWrapper/HomeWrapper'
import Loader from '../Loader/Loader'
import SelectList from '../SelectList/SelectList'
import Turn from '../Turn/Turn'

/**
 * TODO: Sistema de filtro
 * TODO: Clipboard
 * TODO: Componente loading
 * TODO: Formateo de horas
 * TODO: Añadir mas informacion de registro de turnos (fecha y hora de registro)
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
			<h1>DASHBOARD de {user.displayName}</h1>
			<Link to='/dashboard/agregar-turno'>Agregar nuevo turno</Link>
			<div className='filters'>
				<SelectList id='placeToShift' title='Lugar' handleChange={handleChangeFilterByPlace} data={listPlaces}/>
				<SelectList id='dateTurn' title='fecha del turno' handleChange={handleChangeFilterByDate} data={listDates}/>
			</div>
			{loading && <Loader/>}
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
		</HomeWrapper>
	)
}

export default Dashboard