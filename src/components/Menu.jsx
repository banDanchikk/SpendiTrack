import React from 'react'
import { useState } from 'react'
import Modal from './Modal'
import Form from './Form'
import Add from '../images/plus.png'
import Wallet from '../images/wallet.png'
import Chart from '../images/chart-pie-alt.png'
import { Link } from 'react-router-dom';


export default function Menu() {
  const [modalActive, setModalActive] = useState(false)
  return (
    <div className='menu'>
        <Link to="/"><button className='menu-icon'><img className='image' src={Wallet}/></button></Link>
        <button className='menu-icon' onClick={()=>setModalActive(true)}><img className='image' src={Add}/></button>
        <Link to="/statistics"><button className='menu-icon'><img className='image' src={Chart}/></button></Link>
      <Modal active={modalActive} setActive={setModalActive}>
        <Form/>
      </Modal>
    </div>
  )
}
