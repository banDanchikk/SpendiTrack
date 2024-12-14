import React from 'react'
import Accordion from './Accordion'
import LogOut from '../exit.png'


export default function HelpContainer() {
  return (
    <div className='acc-container' style={{display: 'flex', flexDirection:'column'}}>
      <Accordion title="Help Center">
      <p>Here is the summary of your expenses for the current month.</p>
      </Accordion>
      <Accordion title="Instructions">
      <p>Here is the summary of your expenses for the current month.</p>
      </Accordion>
      <Accordion title="Invite Friend">
        <p>Here is the summary of your expenses for the current month.</p>
      </Accordion>
      <button className='profile-btn'>Log Out<img src={LogOut}/></button>
    </div>
  )
}
