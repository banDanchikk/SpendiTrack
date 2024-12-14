import React, { useEffect, useState } from 'react';
import Accordion from './Accordion';
import LogOut from '../images/exit.png';
import Modal from '../components/Modal';
import { firestore } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useAuth } from '../register-components/AuthContext';

export default function AccContainer() {
  const [modalActive, setModalActive] = useState(false); 
  const [limit, setLimit] = useState(''); 
  const [currentLimit, setCurrentLimit] = useState(0); 
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    phone: '',
    monthLimit: 0,
  });
  const { user, logout } = useAuth(); 

  const handleLogout = async () => {
    await logout();
  };

  const saveLimitToFirestore = async () => {
    if (!limit || isNaN(limit)) {
      alert('Please enter a valid numeric limit.');
      return;
    }

    try {
      if (!user) {
        alert('User is not logged in.');
        return;
      }

      const userDoc = doc(firestore, 'users', user.uid); 
      await setDoc(
        userDoc,
        { monthLimit: parseFloat(limit) }, 
        { merge: true } 
      );
      setCurrentLimit(parseFloat(limit)); 
      setModalActive(false); 
    } catch (error) {
      console.error('Error saving limit to Firestore:', error);
    }
    window.location.reload()
  };

  const fetchUserDataFromFirestore = async () => {
    try {
      if (!user) {
        console.warn('User is not logged in.');
        return;
      }

      const userDoc = doc(firestore, 'users', user.uid); 
      const userSnapshot = await getDoc(userDoc);

      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        setUserData({
          username: userData.username || '',
          email: userData.email || '',
          phone: userData.phone || '',
          monthLimit: userData.monthLimit || 0,
          date: userData.date || '',
        }); 
      } else {
        console.warn('User document does not exist');
      }
    } catch (error) {
      console.error('Error fetching user data from Firestore:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserDataFromFirestore();
    }
  }, [user]); 

  return (
    <div className='acc-container' style={{ display: 'flex', flexDirection: 'column' }}>
      <Accordion title="Personal Info">
        <div style={{ padding: '20px' }}>
          <h2>Username: {userData.username || 'N/A'}</h2>
          <h2>Email: {userData.email || 'N/A'}</h2>
          <br />
          <h2>Phone Number: {userData.phone || 'N/A'}</h2>
          <h2>Date of Birth: {userData.date || 'N/A'}</h2>
        </div>
      </Accordion>
      <Accordion title="Monthly spending limit">
        <div style={{ padding: '20px' }}>
          <h2>Current limit: {userData.monthLimit} грн</h2>
          <button className='profile-btn' onClick={() => setModalActive(true)}>Set Limit</button>
          <Modal active={modalActive} setActive={setModalActive}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
              <h1 className='title' style={{color:'black', fontSize:'2em'}}>Setting Limit</h1>
              <div className='field'>
                <h1>Enter Month Limit:</h1>
                <input
                  type='text'
                  name='amount'
                  className='comment'
                  placeholder='Enter limit'
                  value={limit} 
                  onChange={(e) => setLimit(e.target.value)}
                  style={{ paddingLeft: '10px', width: '50%' }}
                />
              </div>
              <button
                style={{ marginTop: '20px' }}
                className='profile-btn'
                onClick={saveLimitToFirestore}
              >
                Save Limit
              </button>
            </div>
          </Modal>
        </div>
      </Accordion>
      <button onClick={handleLogout} className='profile-btn'>Log Out<img src={LogOut} alt="Log Out" /></button>
    </div>
  );
}
