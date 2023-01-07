import React from 'react'
import {  Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'
const Home = () => {

  const { user } = useAuth();

  if(user){
    return <Navigate to='/dashboard'/>
  } else{
    return <Navigate to='/login'/>
  }
}

export default Home