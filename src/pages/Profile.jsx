import React from 'react'
import { Link } from 'react-router-dom';

export default function Profile({image}) {

  return (
    <div className='profile-container'>
        <Link to="/profile"><img src={image} className='profile-pic'/></Link>
    </div>
  )
}
