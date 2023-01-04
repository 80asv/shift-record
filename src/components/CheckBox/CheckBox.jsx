import React from 'react'
import './CheckBox.scss'

const CheckBox = ({name, title}) => {
  return (
    <div className='checkbox-div'>
        <label class="b-contain">
            <span>{title}</span>
            <input type="checkbox" />
            <div class="b-input"></div>
        </label>
    </div>
  )
}

export default CheckBox