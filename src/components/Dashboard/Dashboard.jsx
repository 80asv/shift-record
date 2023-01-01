import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { deleteTurn, getTurns, updateTurn } from '../../db/firebase'
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

  	return (
		<HomeWrapper>
			<h1>DASHBOARD de {user.displayName}</h1>
			<Link to='/dashboard/agregar-turno'>Agregar nuevo turno</Link>
			<h3>Aqui iran los turnos</h3>
			{
				turns.map((turn) => <Turn
					key={turn.id}
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