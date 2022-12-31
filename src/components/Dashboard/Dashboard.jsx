import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getTurns } from '../../db/firebase'
import HomeWrapper from '../HomeWrapper/HomeWrapper'
import Turn from '../Turn/Turn'

const Dashboard = () => {
	const { user } = useAuth();
	const [turns, setTurns] = useState([]);

	useEffect(() => {
		const getTurnsList = async () => {
		const res = await getTurns(user.uid);
		setTurns(res);
		}
		getTurnsList();
	}, []);

	const handleDeleteTurn = () => {

	}

	const handleEditTurn = () => {}
  

  	console.log(turns);

  	return (
		<HomeWrapper>
			<h1>DASHBOARD de {user.displayName}</h1>
			<Link to='/dashboard/agregar-turno'>Agregar nuevo turno</Link>
			<h3>Aqui iran los turnos</h3>
			{
			turns.map((turn) => <Turn
				key={turn.id}
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