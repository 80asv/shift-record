import React from 'react'

const Loader = () => {
  return (
    <div style={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <img src="/spinLoader.svg" alt="Loading..." style={{height: '200px', width: '200px'}}/>
    </div>
  )
}

export default Loader