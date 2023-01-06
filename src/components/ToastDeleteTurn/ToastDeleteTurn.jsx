import React from 'react'
import { toast } from 'react-hot-toast';
import './ToastDeleteTurn.scss'


const ToastDeleteTurn = ({handleClick, actionToast}) => {
  return (
    <div className='toast'>
        <h2 className='toast__title'>¿Deseas eliminar este turno?</h2>
        <div className='toast__btns'>
            <button className='toast__btns-delete toast__btns-btn' onClick={() => {
                handleClick();
                toast.dismiss(actionToast.id);
            }}>Eliminar</button>
            <button className='toast__btns-cancel toast__btns-btn' onClick={() => toast.dismiss(actionToast.id)}>Cancelar</button>
        </div>
    </div>
  )
}

export default ToastDeleteTurn