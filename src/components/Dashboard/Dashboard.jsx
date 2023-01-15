import { faBook } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { onMessage } from 'firebase/messaging'
import moment from 'moment/moment'
import React, { useEffect, useState } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import { toast } from 'react-hot-toast'
import { toast as toasty, ToastContainer } from "react-toastify";
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { deleteTurn, getTurns, messaging, updateTurn } from '../../db/firebase'
import HomeWrapper from '../HomeWrapper/HomeWrapper'
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../Loader/Loader'
import SelectList from '../SelectList/SelectList'
import Turn from '../Turn/Turn'
import './Dashboard.scss'

const Dashboard = () => {
	const { user, enableNotifications } = useAuth();
	const [turns, setTurns] = useState([]);
	const [loading, setLoading] = useState(true);
	const [isFilteredByPlace, setIsFilteredByPlace] = useState(false);
	// const [isFiltereByDateTurn, setIsFiltereByDateTurn] = useState(false); //! Sin uso
	const [isFilteredByMounth, setIsFilteredByMounth] = useState(false);

	const [place, setPlace] = useState('');
	// const [date, setDate] = useState(''); //! Sin uso
	const [mounth, setMounth] = useState('')

	const [listPlaces, setListPlaces] = useState([]);
	// const [listDates, setListDates] = useState([]); //! Sin uso
	const [listMouths, setListMouths] = useState([]);
	const [collectedThisMounth, setCollectedThisMounth] = useState(0);

	useEffect(() => {
        onMessage(messaging, msg =>  toasty(msg.notification.title))
    }, [])

	useEffect(() => {
		enableNotifications();
		const getTurnsList = async () => {
			const res = await getTurns(user.uid);

			/* Listas */
			setListPlaces(() => { // listar lugares
				const places = res.map((turn) => turn.placeToShift);
				return [...new Set(places)]; // eliminar los repetidos
			})

			// setListDates(() => { // listar fechas //! Sin uso
			// 	const dates = res.map(turn => turn.dateTurn);
			// 	return [...new Set(dates)];
			// })

			setListMouths(() => { // listar meses
				const dates = res.map(turn => moment(turn.dateTurn, 'YYYY-MM-DD').format('MMMM YYYY'));
				return [...new Set(dates)];
			})

			setCollectedThisMounth(()=> {
				const currentMounth = moment().format('MM');
				const filterDates = res.filter(turn => moment(turn.dateTurn, 'YYYY-MM-DD').format('MM') === currentMounth);
				let totalCollectedThisMounth = 0;
				filterDates.forEach(turn => totalCollectedThisMounth+=turn.priceShift )
				return totalCollectedThisMounth;
			})

			/* Filtros */
			if(isFilteredByPlace){ // filtro por lugares
				setTurns(() => {
					const placesFiltered = res.filter((turn) => turn.placeToShift === place);
					return placesFiltered;
				});
			}/* else if(isFiltereByDateTurn){ // filtro por fechas //! Sin uso
				setTurns(() => {
					const datesFiltered = res.filter((turn) => turn.dateTurn === date);
					return datesFiltered
				});
			}*/else if(isFilteredByMounth){
				setTurns(() => { // filtro por meses
					const datesFiltered = res.filter((turn) => moment(turn.dateTurn, 'YYYY-MM-DD').format('MMMM YYYY') === mounth)
					return datesFiltered;
				})
			} else {
				setTurns(res);
			}
			setLoading(false);
		}
		console.log('first');
		getTurnsList();
	}, [mounth, /* date, isFiltereByDateTurn */, isFilteredByPlace, place, user.uid, user]); // TODO: REVISAR SI SE ESTA CICLANDO

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

	// const handleChangeFilterByDate = (e) => { //! Sin uso
	// 	setDate(e.target.value);
	// 	if(e.target.value !== ''){
	// 		setIsFiltereByDateTurn(true)
	// 	} else {
	// 		setIsFiltereByDateTurn(false)
	// 	}
	// }

	const handleChangeFilterByMouth = (e) => {
		setMounth(e.target.value);
		if(e.target.value !== '' ){
			setIsFilteredByMounth(true);
		} else {
			setIsFilteredByMounth(false);
		}
	}

	const copyShiftsToClipBoard = () => {
		let text = 'Turnos laborales\n\n';
		if(turns.length <= 0) return;
		turns.forEach(({placeToShift, dateTurn, admissionTime, departureTime}) => {
			text+=`Lugar Turno: ${placeToShift}\nFecha: ${moment(dateTurn, 'YYYY-MM-DD').format('DD/MM/YYYY')}\nHora Ingreso: ${moment(admissionTime, 'HH:mm').format('hh:mm A')}\nHora Salida: ${moment(departureTime, 'HH:mm').format('hh:mm A')}\n\n`;
		})
		return text;
	}
  

  	return (
		<HomeWrapper>
				<ToastContainer/>
				<div className='dashboard__header'>
					<h2>
						<p className='dashboard__header-saludo'>Bienvenid@</p>
						<p className='dashboard__header-saludo-name'>
							{user.displayName}
						</p>
					</h2>
					<div className="card">
						<div className='card__info'>
							<p className='card__info-title'>Total recogido este mes</p>
							<p className='card__info-money'>${collectedThisMounth.toLocaleString('co-CO', {maximumFractionDigits: 1})} COP</p>
							<p className='card__info-label'>suma total del mes de {moment().format('MMMM')}</p>
						</div>

						<CopyToClipboard text={copyShiftsToClipBoard()}>
							<button className='card__btn' onClick={() => toasty.success('Turnos visibles copiados!', {
								position: "top-right",
								autoClose: 2000,
								hideProgressBar: false,
								closeOnClick: true,
								pauseOnHover: true,
								draggable: true,
								progress: undefined,
								theme: "colored",
							})}>
								<FontAwesomeIcon icon={faBook} className='card__btn-icon'/>
								<p className='card__btn-label'>Copiar turnos visibles</p>
							</button>
						</CopyToClipboard>
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
							<SelectList className='main__btns-filters-place main__btns-filters-btn' id='placeToShift' title='lugares' handleChange={handleChangeFilterByPlace} data={listPlaces} isFiltered={isFilteredByPlace}/>
							<SelectList className='main__btns-filters-date main__btns-filters-btn' id='mounths' title='mes' handleChange={handleChangeFilterByMouth} data={listMouths} isFiltered={isFilteredByMounth}/>
							{/* <SelectList className='main__btns-filters-date main__btns-filters-btn' id='dateTurn' title='fechas' handleChange={handleChangeFilterByDate} data={listDates}/> // !Sin uso */}
						</div>
					</div>
						<div className="main__turns">
								{
									turns.length <= 0 && !loading &&
									<p style={{
										fontSize: '22px', 
										color: 'var(--color-grey)', 
										width: '100%',
										display: 'flex',
										justifyContent: 'center'
									}}>No hay turnos que mostrar</p> 
								}
								{
									turns.map((turn) => <Turn
										key={turn.id}
										typeShift={turn.typeShift}
										priceShift={turn.priceShift}
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