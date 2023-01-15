import React, { useEffect, useRef, useState } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard';
import { toast, Toaster } from 'react-hot-toast';
import moment from 'moment/moment';
import './Turn.scss'
import 'moment/locale/es';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCopy, faPenToSquare, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
import RadioBtn from '../RadioBtn/RadioBtn';
import ToastDeleteTurn from '../ToastDeleteTurn/ToastDeleteTurn';
import { toast as toasty, ToastContainer } from 'react-toastify';

const Turn = ({ id, placeToShift, dateTurn, admissionTime, departureTime, onDelete, onEdit, docId, timeStamp, priceShift, typeShift, workingHours }) => {
    
    moment.locale('es');

    const [isEditable, setIsEditable] = useState(false);
    const [cPlace, setCPlace] = useState(placeToShift);
    const [cDate, setCDate] = useState(dateTurn);
    const [cAdmissionTime, setCAdmissionTime] = useState(admissionTime);
    const [cDepartureTime, setCDepartureTime] = useState(departureTime);
    const [cTypeShift, setCTypeShift] = useState(typeShift);
    const [cPriceShift, setCPriceShift] = useState(priceShift);
    const [cWorkingHours, setCWorkingHours] = useState(workingHours);

    const copyToClipboardValues = `Lugar Turno: ${cPlace}\nFecha: ${cDate}\nHora Ingreso: ${cAdmissionTime}\nHora Salida: ${cDepartureTime}`

    const turnRef = useRef(null);

    useEffect(() => {
        if(turnRef.current){
            turnRef.current.focus();
        }
        setCWorkingHours(() => {
			let date1 = moment(cAdmissionTime, 'hh:mm A');
			let date2 = moment(cDepartureTime, 'hh:mm A');
			return (date1.diff(date2, 'hours') * (-1));
		})
		setCPriceShift(() => {
			const NORMAL = 34573;
			const MEDIUM = 23073;
			const FESTIVE = 51823;

			if(cAdmissionTime === '' || cDepartureTime === ''){
				return 0;
			} else {
				let priceHour = 0;
				switch (cTypeShift) {
					case 'normal': priceHour = (NORMAL/8); break;
					case 'medio': priceHour = (MEDIUM/4); break;
					case 'festivo': priceHour = (FESTIVE/8); break;
					case '': return 0;
					default: return 0;
				}
				return (priceHour*cWorkingHours);
			}
		})
    }, [isEditable, cAdmissionTime, cDepartureTime, cTypeShift, cWorkingHours])
    
    
    const handleChangePlace = ({ target: { value } }) => setCPlace(value);
    const handleChangeDateTurn = ({ target: { value } }) => setCDate(value);
    const handleChangeAdmissionTime = ({ target: { value } }) => setCAdmissionTime(value);
    const handleChangeDepartureTime = ({ target: { value } }) => setCDepartureTime(value);
    const handleChangeTypeShift = ({ target: { value } }) => setCTypeShift(value)

    const handleEditTurn = () => setIsEditable(true);

    const handleConfirmEdit = () => {
        setIsEditable(false);
        const turnEdited = {
            placeToShift: cPlace,
            dateTurn: cDate,
            admissionTime: cAdmissionTime,
            departureTime: cDepartureTime,
            workingHours: cWorkingHours,
            priceShift: cPriceShift,
            typeShift: cTypeShift
        }
        onEdit(docId, turnEdited);
        toasty.info('Turno actualizado', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }

    const handleConfirmDelete = () => {
        toast((t) => (
            <ToastDeleteTurn handleClick={handleDelete} actionToast={t}/>
        ));
    }

    const handleDelete = () => {
        onDelete(docId);
        toasty.info('El turno ha sido eliminado', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
    };

    const handleCancelEdit = () => {
        setCPlace(placeToShift);
        setCDate(dateTurn);
        setCAdmissionTime(admissionTime);
        setCDepartureTime(departureTime);
        setCPriceShift(priceShift);
        setCWorkingHours(workingHours);
        setCTypeShift(typeShift);
        setIsEditable(false);
    };

    const handleCopyToClipBoard = () => {
        toasty.success('Copiado al portapapeles', {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
    }

    const calculateTimeTravel = (time) => {
        let calculatedTime = moment(time, 'MMMM Do YYYY, h:mm:ss a').startOf('minute').fromNow();
        return calculatedTime;
    }

    const formatTimestamp = (timeStamp) => {
        return moment(timeStamp, 'MMMM Do YYYY, h:mm:ss a').format('D/MM/YY');
    }
    
    return (
        <div id={id} className={`turn ${isEditable ? 'turn-edit' : ''}`}>
            {
                isEditable ? (
                    <>
                        <div className="turn__header">
                            <input type="text" name='placeToShift' 
                                className='turn__header-place-edit'
                                value={cPlace} 
                                onChange={handleChangePlace}
                            />
                            <div className='turn__header-btns'>
                                <button onClick={handleConfirmEdit} className='turn__btn confirm'>
                                    <FontAwesomeIcon icon={faCheck}/>
                                </button>
                                <button onClick={handleCancelEdit} className='turn__btn cancel'>
                                    <FontAwesomeIcon icon={faXmark}/>
                                </button>
                            </div>
                        </div>
                        <div className='turn__body'>
                            <div className='turn__body-dates-edit'>
                                <p>
                                    <b style={{fontWeight: '700'}}>Fecha:</b> 
                                    <input type="date" name='dateTurn'  
                                        value={cDate} 
                                        onChange={handleChangeDateTurn}
                                    />
                                </p>
                                <p>
                                    <b style={{fontWeight: '700'}}>Hora ingreso:</b>
                                    <input type="time" name='admissionTime' 
                                        value={cAdmissionTime} 
                                        onChange={handleChangeAdmissionTime}
                                    />
                                </p>
                                <p>
                                    <b style={{fontWeight: '700'}}>Hora salida:</b>
                                    <input type="time" name='departureTime'
                                        value={cDepartureTime} 
                                        onChange={handleChangeDepartureTime}
                                    />
                                </p>
                            </div>

                            <div className='turn__footer-edit'>
                                <p className='form__card-footer-info-priceshift'>Valor del turno: ${cPriceShift.toLocaleString('co-CO', {maximumFractionDigits: 1})} COP</p>
                                <div className='form__card-inputs-type-shift'>
                                    <label style={{fontWeight: '700', fontSize: '1rem'}}>Horario de turno</label>
                                    <div className='form__card-inputs-type-shift-radiobtn'>
                                        <RadioBtn name='typeShift' title='normal' handleChange={handleChangeTypeShift} value='normal'/>
                                        <RadioBtn name='typeShift' title='medio' handleChange={handleChangeTypeShift} value='medio'/>
                                        <RadioBtn name='typeShift' title='festivo' handleChange={handleChangeTypeShift} value='festivo'/>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </>
                ) : (
                    <>
                        <div className="turn__header">
                            <h2 className='turn__header-place'>{cPlace}</h2>
                            <div className='turn__header-btns'>
                                <button onClick={handleEditTurn} className='turn__btn edit'>
                                    <FontAwesomeIcon icon={faPenToSquare} className='icon'/>
                                </button>
                                <CopyToClipboard text={copyToClipboardValues}>
                                    <button onClick={handleCopyToClipBoard} className='turn__btn copy'>
                                        <FontAwesomeIcon icon={faCopy} className='icon'/>
                                    </button>
                                </CopyToClipboard>
                                <button onClick={handleConfirmDelete} className='turn__btn delete'>
                                    <FontAwesomeIcon icon={faTrash} className='icon'/>
                                </button>
                            </div>
                        </div>
                        <div className='turn__body'>
                            <div className='turn__body-dates'>
                                <p><b style={{fontWeight: '700'}}>Fecha:</b> {moment(cDate, 'YYYY-MM-DD').format('DD/MM/YYYY')}</p>
                                <p><b style={{fontWeight: '700'}}>Hora ingreso:</b> {moment(cAdmissionTime, 'HH:mm:ss').format('h:mm A')}</p>
                                <p><b style={{fontWeight: '700'}}>Hora salida:</b> {moment(cDepartureTime, 'HH:mm:ss').format('h:mm A')}</p>
                            </div>
                            <div className='turn__body-aditionalinfo'>
                                <p className='turn__body-aditionalinfo-price'>Precio turno: ${cPriceShift.toLocaleString('co-CO', {maximumFractionDigits: 1})} COP</p>
                                <p className='turn__body-aditionalinfo-inforegister'>Creado el {formatTimestamp(timeStamp)}, {calculateTimeTravel(timeStamp)}</p>
                            </div>
                        </div>
                    </>
                )
            }
            <Toaster/>
            <ToastContainer/>
        </div>
    )
}

export default Turn