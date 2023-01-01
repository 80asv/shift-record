import React, { useEffect, useRef, useState } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard';
import { toast, Toaster } from 'react-hot-toast';

const Turn = ({ id, placeToShift, dateTurn, admissionTime, departureTime, onDelete, onEdit, docId }) => {

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

    return (
        <div id={id}>
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
                        <h2>{cPlace}</h2>
                        <p>{cDate}</p>
                        <p>{cAdmissionTime}</p>
                        <p>{cDepartureTime}</p>
                        <div>
                            <button onClick={handleEditTurn}>Editar</button>
                            <button onClick={handleConfirmDelete}>Eliminar</button>
                            <CopyToClipboard text={copyToClipboardValues}>
                                <button onClick={handleCopyToClipBoard}>copiar al portapapeles</button>
                            </CopyToClipboard>
                        </div>
                    </>
                )
            }
            <Toaster/>
        </div>
    )
}

export default Turn