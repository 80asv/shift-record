import React from 'react'
import './RadioBtn.scss'

const RadioBtn = ({ title, handleChange, value, name }) => {
  return (
    <div className='radio-div'>
        <label className="b-contain">
            <span>{title}</span>
            <input name={name} type="radio" onChange={handleChange} value={value}/>
            <div className="b-input"></div>
        </label>
    </div>
  )
}

export default RadioBtn