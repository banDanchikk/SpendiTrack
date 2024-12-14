import React, { useState, useEffect } from 'react';
import Icon from '../components/Icon';
import Email from '../images/at.png';
import User from '../images/user.png';
import Phone from '../images/mobile-notch.png';
import Calendar from '../images/calendar-lines.png';
import { doc, getDoc, setDoc } from '@firebase/firestore';
import { firestore } from '../firebase';
import Category from '../components/Category';
import { useAuth } from '../register-components/AuthContext';


export default function EditProfile() {
  const { user } = useAuth(); 
  const [color, setColor] = useState('#000000');
  const [emoji, setEmoji] = useState('😎');
  const [accData, setAccData] = useState({
    username: '',
    email: '',
    phone: '',
    date: '',
    color: ''
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (!user) {
          console.warn('User is not logged in.');
          return;
        }
        
        const userDocRef = doc(firestore, 'users', user.uid); 
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          setAccData({
            username: data.username || '',
            email: data.email || '',
            phone: data.phone || '',
            date: data.date || '',
            color: data.color || '#000000'
          });
          setColor(data.color || '#000000');
        }
      } catch (error) {
        console.error('Error fetching profile data: ', error);
      }
    };

    if (user) {
      fetchProfileData();
    }
  }, [user]); 


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!user) {
        console.warn('User is not logged in.');
        return;
      }

      const userDocRef = doc(firestore, 'users', user.uid); 
      await setDoc(userDocRef, accData, { merge: true }); 

      console.log('Profile updated successfully');
      location.reload(); 
    } catch (error) {
      console.error('Error updating profile: ', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAccData({
      ...accData,
      [name]: value
    });
  };

  const handleEmojiSelect = (emoji) => {
    setAccData({
      ...accData,
      emoji,
    });
  };

  return (
    <form className='form-container' onSubmit={handleSubmit}>
      <h1 className='title' style={{color:'black', fontSize:'2em'}}>Editing Profile</h1>
      <div className='field'>
        <Icon picture={User}/>
        <input
          type='text'
          name='username'
          className='comment'
          placeholder='username'
          value={accData.username}
          onChange={handleChange}
        />
      </div>
      <div className='field'>
        <Icon picture={Email}/>
        <input
          type='text'
          name='email'
          className='comment'
          placeholder='e-mail'
          value={accData.email}
          onChange={handleChange}
        />
      </div>
      <div className='field'>
        <Icon picture={Phone}/>
        <input
          type='phone'
          name='phone'
          className='comment'
          placeholder='phone number'
          value={accData.phone}
          onChange={handleChange}
        />
      </div>
      <div className='field'>
        <Icon picture={Calendar}/>
        <input
          type='date'
          name='date'
          className='date'
          placeholder='date of birth'
          value={accData.date}
          style={{width:'12.5em'}}
          onChange={handleChange}
        />
      </div>
      <div className='field'>
        <label style={{fontWeight:'bold', fontSize:'1.5em'}}>Icon Color:</label>
        <input
          type='color'
          name='color'
          value={color}
          onChange={(e) => {
            setColor(e.target.value);
            setAccData({
              ...accData,
              color: e.target.value
            });
          }}
          style={{width:'8em'}}
        />
      </div>
      <div className='field'>
        <label style={{ fontWeight: 'bold', fontSize: '1.5em', whiteSpace: 'nowrap'}}>Choose Avatar:</label>
        <select
          name='emoji'
          value={emoji}
          onChange={(e) => {
            setEmoji(e.target.value);
            setAccData({
              ...accData,
              emoji: e.target.value,
            });
          }}
          style={{
            fontSize: '1.5em',
            padding: '2px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            backgroundColor: 'white',
            cursor: 'pointer',
          }}
        >
          {['🥸', '😎', '🥰', '🤑', '😉', '👿', '🤡', '🤪', '🐵', '🐶', '😺', '👽'].map((emoji) => (
            <option key={emoji} value={emoji}>
              {emoji}
            </option>
          ))}
        </select>
      </div>
      <button className='submit' type="submit" style={{width: '13em'}}>Submit</button>
    </form>
  );
}
