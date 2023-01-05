import React from 'react'
import './RadioBtn.scss'

const RadioBtn = ({ title, handleChange, value, name }) => {
  return (
    <div className='radio-div'>
        <label class="b-contain">
            <span>{title}</span>
            <input name={name} type="radio" onChange={handleChange} value={value}/>
            <div class="b-input"></div>
        </label>
    </div>
  )
}

export default RadioBtn