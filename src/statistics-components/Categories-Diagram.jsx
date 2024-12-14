import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { firestore, auth } from '../firebase'; 

export default function CategoriesDiagram() {
  const [expenses, setExpenses] = useState([]);
  const [interval, setInterval] = useState(true);  
  
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

        if (!userDoc.exists()) {
          console.warn('User document not found');
          return;
        }

        const expensesList = userDoc.data().expenses || []; 

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1); 
        const startYear = new Date(now.getFullYear(), 0, 1);  

        const filteredExpenses = expensesList.filter((expense) => {
          const expenseDate = new Date(expense.date); 
          return (
            (interval && expenseDate >= startOfMonth && expenseDate < new Date(now.getFullYear(), now.getMonth() + 1, 1)) ||
            (!interval && expenseDate >= startYear && expenseDate < new Date(now.getFullYear() + 1, 0, 1)) 
          );
        });
        setExpenses(filteredExpenses);
      } catch (error) {
        console.error('Error fetching expenses:', error);
      }
    };

    fetchExpenses();
  }, [interval]); 
  
  const groupedExpenses = expenses.reduce((acc, expense) => {
    const { category, amount } = expense;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += amount;
    return acc;
  }, {});

  const data = Object.keys(groupedExpenses).map((category) => ({
    name: category,
    value: groupedExpenses[category],
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6384', '#36A2EB', '#FF9F40', '#4BC0C0', '#9966FF', '#FFCD56', '#2D87B8'];
  const INFO = [
    { emoji: '🥑', name: 'Food&Drinks' },
    { emoji: '🎲', name: 'Entertainment' },
    { emoji: '💊', name: 'Health' },
    { emoji: '💄', name: 'Beauty' },
    { emoji: '🚌', name: 'Transport' },
    { emoji: '💸', name: 'Business' },
    { emoji: '🎨', name: 'Hobby' },
    { emoji: '🏠', name: 'Household Expenses' },
    { emoji: '💌', name: 'Charity' },
    { emoji: '😺', name: 'Pets' },
    { emoji: '📖', name: 'Education' },
  ];

  return (
    <div className="diagram-container">
      <h1 className="stat-header">Expenses by Category</h1>
      <div className="inside-container">
        <PieChart width={400} height={400}>
          <Pie
            data={data}
            cx={200}
            cy={200}
            innerRadius={60}
            outerRadius={120}
            paddingAngle={0}
            dataKey="value"
            label={(entry) => `${entry.name}: ${entry.value}`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
        <div className="pie-legend">
          <ul>
            {INFO.map((inf, index) => (
              <li key={index}>{`${inf.emoji} - ${inf.name}`}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="btn-container">
        <button
          className={!interval ? 'date-btn' : 'date-btn-clicked'}
          onClick={() => setInterval(true)}
        >
          Month
        </button>
        <button
          className={interval ? 'date-btn' : 'date-btn-clicked'}
          onClick={() => setInterval(false)}
        >
          Year
        </button>
      </div>
    </div>
  );
}
