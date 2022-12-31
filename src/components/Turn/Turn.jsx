import React from 'react'

const Turn = ({ id, placeToShift, dateTurn, admissionTime, departureTime, onDelete, onEdit, docId }) => {
  return (
    <div id={id}>
        <h2>{placeToShift}</h2>
        <p>{dateTurn}</p>
        <p>{admissionTime}</p>
        <p>{departureTime}</p>
        <div>
            <button>Editar</button>
            <button>Eliminar</button>
            <button>copiar al portapapeles</button>
        </div>
    </div>
  )
}

export default Turn