import { faDownload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import './DownloadAppBtn.scss'

const DownloadAppBtn = ({ handleClick }) => {
  return (
    <button onClick={handleClick} className='downloadbtn'>
        <FontAwesomeIcon icon={faDownload} className='downloadbtn__icon'/>
    </button>
  )
}

export default DownloadAppBtn