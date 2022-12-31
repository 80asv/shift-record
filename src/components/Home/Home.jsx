import React from 'react'
import { Link, Navigate, useFetcher } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'
import AddTurn from '../AddTurn/AddTurn';
import HomeWrapper from '../HomeWrapper/HomeWrapper';
const Home = () => {

  const { user, logout, loading } = useAuth();

  
  if(user){
    return <Navigate to='/dashboard'/>
  } else{
    return <Navigate to='/login'/>
  }
}

export default Home