import React from 'react'
import { Link } from 'react-router-dom'
import HomeWrapper from '../HomeWrapper/HomeWrapper'

const AddTurn = () => {
  return (
    <HomeWrapper>
        <h2>Agregar nuevo turno</h2>
        <Link to='/dashboard'>Volver</Link>
        <label htmlFor="lugar">Lugar del turno</label>
        <input type="text" name="lugar" id="lugar" />
        <label htmlFor="dia_inicio">Dia de Inicio</label>
        <input type="date" name="dia_inicio" id="dia_inicio" />
        <label htmlFor="hora_entrada">Hora de ingreso</label>
        <input type="datetime" name="hora_entrada" id="hora_entrada" />
        <label htmlFor="hora_salida">Hora de salida</label>
        <input type="datetime" name="hora_salida" id="hora_salida" />
        <input type="submit" value="Agregar" />
    </HomeWrapper>
  )
}

export default AddTurn