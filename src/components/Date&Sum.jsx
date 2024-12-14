import React from 'react'
import '../index.css'

export default function DateSum({date, sum}) {
  return (
    <div className='date-sum'>
        <h2 className='date-info'>{date}</h2>
        <h2 className='exp-price'>{sum}</h2>
    </div>
  )
}
