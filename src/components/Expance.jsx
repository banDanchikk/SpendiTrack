import React from 'react'
import Category from './Category';
import '../index.css';


export default function Expance({category, comment, price}) {
  return (
    <div className='expance'>
        <div className="exp-category">
          <Category emoji={category}/>
        </div>
        <h2 className='exp-com'>{comment}</h2>
        <h3 className='exp-price'>{price}</h3>
    </div>
  )
}
