import React, { useEffect, useState } from 'react';
import EdProf from '../images/user-pen.png';
import Modal from '../components/Modal';
import EditProfile from './EditProfile';
import { doc, getDoc } from '@firebase/firestore';
import { firestore } from '../firebase'; 
import { useAuth } from '../register-components/AuthContext';

export default function TopInfo() {
  const { user } = useAuth(); 
  const [myInfo, setMyInfo] = useState({ color: 'transparent', emoji: '' });
  const [modalActive, setModalActive] = useState(false);

 
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!user) {
          console.warn('User is not logged in.');
          return;
        }

        const userDocRef = doc(firestore, 'users', user.uid); 
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          setMyInfo({
            emoji: data.emoji || '🥸', 
            color: data.color || 'transparent',
            name: data.username || 'undefined', 
            email: data.email || 'e-mail',
          });
        } else {
          console.warn('User data not found.');
        }
      } catch (error) {
        console.error('Error fetching user data: ', error);
      }
    };

    if (user) {
      fetchUserData(); 
    }
  }, [user]); 

  return (
    <div className='acc-container'>
      <div
        className='profile-pic'
        style={{
          backgroundColor: myInfo.color,
          fontSize: '3em',
          width: '2em', 
          height: '2em',
          borderRadius: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {myInfo.emoji}
      </div>
      <div className='main-info'>
        <h1>{myInfo.name}</h1>
        <h3>{myInfo.email}</h3>
      </div>
      <button
        onClick={() => setModalActive(true)}
        className='profile-btn'
        style={{
          width: '2.5em',
          height: '2.5em',
          borderRadius: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          paddingRight: '10px',
          marginTop: '10px',
        }}
      >
        <img
          src={EdProf}
          style={{ width: '1.5em', height: '1.5em' }}
        />
      </button>
      <Modal active={modalActive} setActive={setModalActive}>
        <EditProfile />
      </Modal>
    </div>
  );
}
