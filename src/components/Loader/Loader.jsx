import React from 'react'
import './Loader.scss'

const Loader = ({height, width}) => {
  return (
    <div className='loader'>
        <img src="/spinLoader.svg" alt="Loading..." style={{height: height, width: width}}/>
    </div>
  )
}

export default Loader