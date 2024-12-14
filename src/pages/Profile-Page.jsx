import React from 'react'
import Menu from '../components/Menu'
import TopInfo from '../profile-components/TopInfo'
import AccContainer from '../profile-components/AccContainer'


export default function ProfilePage() {
  return (
    <div>
      <div className='profPage-container'>
        <TopInfo/>
        <h2 style={{color: 'white', fontWeight: 'bold', fontSize: '2em'}}>Account info</h2>
        <AccContainer/>
      </div>
      <Menu/>
    </div>
  )
}
