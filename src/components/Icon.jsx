import React from 'react'
import '../index.css'

export default function Icon({picture}) {
  return (
    <div className='icon'><img className = 'image' src={picture} alt='Calendar Icon' /></div>
  )
}
