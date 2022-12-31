import React from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import HomeWrapper from '../HomeWrapper/HomeWrapper'

const Dashboard = () => {

  const { user } = useAuth();

  return (
    <HomeWrapper>
        <h1>DASHBOARD de {user.displayName}</h1>
        <Link to='/dashboard/agregar-turno'>Agregar nuevo turno</Link>
        <p>Aqui iran los turnos</p>
    </HomeWrapper>
  )
}

export default Dashboard