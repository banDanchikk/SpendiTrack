import React, { useEffect, useState } from 'react';
import '../index.css';
import Expance from './Expance';
import { doc, getDoc } from 'firebase/firestore';
import { firestore, auth } from '../firebase';
import DateSum from './Date&Sum';

export default function Expances() {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [interval, setInterval] = useState(true); 
  const options = { year: 'numeric', month: 'long', day: 'numeric' };

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          console.warn('User is not logged in.');
          return;
        }

        const uid = user.uid; 
        const userDocRef = doc(firestore, 'users', uid); 

        const userDoc = await getDoc(userDocRef); 
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setExpenses(userData.expenses || []);
        } else {
          console.error('User document not found');
        }
      } catch (error) {
        console.error('Error fetching expenses: ', error);
      }
    };

    fetchExpenses();
  }, []); 

  useEffect(() => {
    const filterExpenses = () => {
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

      let filteredData = [];

      if (interval) {
        
        filteredData = expenses.filter(expense => {
          const expenseDate = new Date(expense.date);
          return expenseDate.toDateString() === today.toDateString();
        });
      } else {
        
        filteredData = expenses.filter(expense => {
          const expenseDate = new Date(expense.date);
          return expenseDate >= startOfMonth && expenseDate <= endOfMonth;
        });
      }

      
      const groupedExpenses = filteredData.reduce((acc, expense) => {
        const expenseDate = new Date(expense.date).toLocaleDateString('en-GB', options);
        if (!acc[expenseDate]) {
          acc[expenseDate] = [];
        }
        acc[expenseDate].push(expense);
        return acc;
      }, {});

      
      const groupedExpensesArray = Object.keys(groupedExpenses).map(date => ({
        date,
        expenses: groupedExpenses[date]
      }));

      setFilteredExpenses(groupedExpensesArray);
    };

    filterExpenses();
  }, [expenses, interval]); 

  const countSum = (expensesForDate) => {
    return expensesForDate.reduce((sum, expense) => sum + expense.amount, 0);
  };

  return (
    <div className='expance-container'>
      <div className='btn-container'>
        <button className={!interval ? 'date-btn' : 'date-btn-clicked'} onClick={() => setInterval(true)}>Today</button>
        <button className={interval ? 'date-btn' : 'date-btn-clicked'} onClick={() => setInterval(false)}>Month</button>
      </div>

      {filteredExpenses.length > 0 ? (
        filteredExpenses.map(group => (
          <div className='info-container' key={group.date}>
            <DateSum date={group.date} sum={countSum(group.expenses)} />
            <div className='expenses-list'>
              {group.expenses.map(expense => (
                <Expance
                  key={expense.id}
                  category={expense.category}
                  comment={expense.comment}
                  price={expense.amount}
                />
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className='no-expenses'>
          <p>No expenses recorded.</p>
        </div>
      )}
    </div>
  );
}
