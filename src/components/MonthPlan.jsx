import React, { useState, useEffect } from 'react';
import { firestore, auth } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function MonthPlan() {
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [limit, setLimit] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;

        if (!user) {
          console.warn('User is not logged in.');
          return;
        }

        const uid = user.uid;

        const userDoc = doc(firestore, 'users', uid);
        const userSnapshot = await getDoc(userDoc);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          const expensesList = userData.expenses || [];
          const now = new Date();
          const currentMonthYear = `${now.getFullYear()}-${(now.getMonth() + 1)
            .toString()
            .padStart(2, '0')}`;

          const monthlyTotal = expensesList.reduce((total, expense) => {
            const expenseDate = new Date(expense.date);
            const monthYear = `${expenseDate.getFullYear()}-${(expenseDate.getMonth() + 1)
              .toString()
              .padStart(2, '0')}`;

            return monthYear === currentMonthYear ? total + expense.amount : total;
          }, 0);

          setTotalExpenses(monthlyTotal);
          setLimit(userData.monthLimit || 0);
        } else {
          console.warn('User document does not exist.');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const percentage = limit > 0 ? (totalExpenses / limit) * 100 : 0;

  return (
    <>
      <h1 style={{ color: 'white' }}>Spending limit per month</h1>
      <div>
        <progress
          value={percentage > 100 ? 100 : percentage}
          max="100"
          style={
            percentage <= 70
              ? { width: '50%', height: '3em', accentColor: '#ff7875' }
              : { width: '50%', height: '3em', accentColor: '#ff3f3b' }
          }>
          {percentage.toFixed(0)}%
        </progress>
        {totalExpenses === 0 ? (
          <h2 style={{ color: 'white' }}>No expenses found.</h2>
        ) : (
          <div style={{ color: 'white' }}>
            <h2>Expenses for this month: {totalExpenses} / {limit}</h2>
          </div>
        )}
      </div>
    </>
  );
}
