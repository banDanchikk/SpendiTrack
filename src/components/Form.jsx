import React, { useState } from 'react';
import '../index.css';
import Icon from './Icon';
import Calend from '../images/calendar-lines.png';
import Notes from '../images/align-center.png';
import Category from './Category';
import Currency from './Currency';
import { doc, getDoc, updateDoc } from '@firebase/firestore';
import { firestore, auth } from '../firebase';

export default function Form() {
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    date: '',
    comment: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (!user) {
        console.warn('User is not logged in.');
        return;
      }

      const formDataToSave = {
        ...formData,
        amount: Number(formData.amount)
      };

      const uid = user.uid; 
      const userDocRef = doc(firestore, 'users', uid); 

      
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        
        const userData = userDoc.data();
        const updatedExpenses = [...userData.expenses, formDataToSave];

        await updateDoc(userDocRef, {
          expenses: updatedExpenses
        });

        console.log('Expense added successfully');
      } else {
        console.error('User document not found');
      }

      setFormData({
        amount: '',
        category: '',
        date: '',
        comment: ''
      });

      window.location.reload();
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  return (
    <form className='form-container' onSubmit={handleSubmit}>
      <h1 className='title' style={{color:'black', fontSize:'2em'}}>Add Transaction</h1>
      <div className='forms'>
        <div className='field'>
          <Currency val={"EXP"} />
          <input
            type='text'
            name='amount'
            className='money'
            value={formData.amount}
            onChange={handleChange}
            required
          />
        </div>
        <div className='field'>
          <Category emoji={formData.category} />
          <select
            name='category'
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value='🥑'>Food & Drinks</option>
            <option value='🎲'>Entertainment</option>
            <option value='💄'>Beauty</option>
            <option value='💊'>Health</option>
            <option value='💸'>Business</option>
            <option value='🚌'>Transport</option>
            <option value='😺'>Pets</option>
            <option value='💌'>Сharity</option>
            <option value='🏠'>Household</option>
            <option value='🎨'>Hobby</option>
            <option value='📖'>Education</option>
          </select>
        </div>
        <div className='field'>
          <Icon picture={Calend} />
          <input
            type='date'
            name='date'
            className='date'
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        <div className='field'>
          <Icon picture={Notes} />
          <input
            type='text'
            name='comment'
            className='comment'
            value={formData.comment}
            onChange={handleChange}
            placeholder="Additional info"
            required
          />
        </div>
        <button className='submit' type="submit">Submit</button>
      </div>
    </form>
  );
}
