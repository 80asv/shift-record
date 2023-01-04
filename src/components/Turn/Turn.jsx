import React, { useEffect, useRef, useState } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard';
import { toast, Toaster } from 'react-hot-toast';
import moment from 'moment/moment';
import './Turn.scss'
import 'moment/locale/es';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';

const Turn = ({ id, placeToShift, dateTurn, admissionTime, departureTime, onDelete, onEdit, docId, timeStamp }) => {
    
    moment.locale('es');

    const [isEditable, setIsEditable] = useState(false);
    const [cPlace, setCPlace] = useState(placeToShift);
    const [cDate, setCDate] = useState(dateTurn);
    const [cAdmissionTime, setCAdmissionTime] = useState(admissionTime);
    const [cDepartureTime, setCDepartureTime] = useState(departureTime);

    const copyToClipboardValues = `Lugar Turno: ${cPlace}\nFecha: ${cDate}\nHora Ingreso: ${cAdmissionTime}\nHora Salida: ${cDepartureTime}`

    const turnRef = useRef(null);

    useEffect(() => {
        if(turnRef.current){
            turnRef.current.focus();
        }
    }, [isEditable])
    
    
    const handleChangePlace = ({ target: { value } }) => setCPlace(value);
    const handleChangeDateTurn = ({ target: { value } }) => setCDate(value);
    const handleChangeAdmissionTime = ({ target: { value } }) => setCAdmissionTime(value);
    const handleChangeDepartureTime = ({ target: { value } }) => setCDepartureTime(value);

    const handleEditTurn = () => setIsEditable(true);

    const handleConfirmEdit = () => {
        setIsEditable(false);
        const turnEdited = {
            placeToShift: cPlace,
            dateTurn: cDate,
            admissionTime: cAdmissionTime,
            departureTime: cDepartureTime,
        }
        onEdit(docId, turnEdited);
    }

    const handleConfirmDelete = () => {
        toast((t) => (
            <div>
                <h2>¿Estas Seguro de Eliminar este turno?</h2>
                <div>
                    <button onClick={() => {
                        handleDelete();
						toast.dismiss(t.id);
					}}>Eliminar</button>
                    <button onClick={() => toast.dismiss(t.id)}>Cancelar</button>
                </div>
            </div>
        ));
    }

    const handleDelete = () => onDelete(docId);

    const handleCopyToClipBoard = () => {
        toast.success('¡Copiado al portapapeles!');
    }

    const calculateTimeTravel = (time) => {
        let calculatedTime = moment(time, 'DDMMYYYY').startOf('minutes').fromNow();
        return calculatedTime;
    }
    
    return (
        <div id={id} className='turn'>
            {
                isEditable ? (
                    <>
                        <input type="text" name='placeToShift' 
                            value={cPlace} 
                            onChange={handleChangePlace}
                        />
                        <input type="date" name='dateTurn'  
                            value={cDate} 
                            onChange={handleChangeDateTurn}
                        />
                        <input type="time" name='admissionTime' 
                            value={cAdmissionTime} 
                            onChange={handleChangeAdmissionTime}
                        />
                        <input type="time" name='departureTime'
                            value={cDepartureTime} 
                            onChange={handleChangeDepartureTime}
                        />
                        <button onClick={handleConfirmEdit}>Confirmar</button>
                    </>
                ) : (
                    <>
                        <div className="turn__header">
                            <h2 className='turn__header-place'>{cPlace}</h2>
                            <div className='turn__header-btns'>
                                <button onClick={handleEditTurn} className='turn__btn edit'>
                                    <FontAwesomeIcon icon={faPenToSquare}/>
                                </button>
                                <CopyToClipboard text={copyToClipboardValues}>
                                    <button onClick={handleCopyToClipBoard} className='turn__btn copy'>
                                        <FontAwesomeIcon icon={faCopy}/>
                                    </button>
                                </CopyToClipboard>
                                <button onClick={handleConfirmDelete} className='turn__btn delete'>
                                    <FontAwesomeIcon icon={faTrash}/>
                                </button>
                            </div>
                        </div>
                        <div className='turn__body'>
                            <div className='turn__body-dates'>
                                <p><b style={{fontWeight: '700'}}>Fecha:</b> {cDate}</p>
                                <p><b style={{fontWeight: '700'}}>Hora ingreso:</b> {moment(cAdmissionTime, 'HH:mm:ss').format('h:mm A')}</p>
                                <p><b style={{fontWeight: '700'}}>Hora salida:</b> {moment(cDepartureTime, 'HH:mm:ss').format('h:mm A')}</p>
                            </div>
                            <div className='turn__body-aditionalinfo'>
                                <p className='turn__body-aditionalinfo-price'>Precio turno: $45.000 COP</p>
                                <p className='turn__body-aditionalinfo-inforegister'>Creado el {timeStamp} {calculateTimeTravel(timeStamp)}</p>
                            </div>
                        </div>
                        
                    </>
                )
            }
            <Toaster/>
        </div>
    )
}

export default Turn