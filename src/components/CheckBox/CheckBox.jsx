import React from 'react'
import './CheckBox.scss'

const CheckBox = ({title, handleChange, value}) => {
  return (
    <div className='checkbox-div'>
        <label className="b-contain">
            <span>{title}</span>
            <input type="checkbox" onChange={handleChange} checked={value}/>
            <div className="b-input"></div>
        </label>
    </div>
  )
}

export default CheckBox