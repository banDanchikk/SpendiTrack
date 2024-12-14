import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { firestore, auth } from '../firebase';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Awg_Per_Month() {
    const [topCategories, setTopCategories] = useState([]);
    const [interval, setInterval] = useState(true); 

    useEffect(() => {
        const fetchTopCategories = async () => {
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

                let filteredExpenses = expensesList;

                if (interval) {
                    const now = new Date();
                    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
                    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

                    filteredExpenses = expensesList.filter((expense) => {
                        const expenseDate = new Date(expense.date);
                        return expenseDate >= currentMonthStart && expenseDate <= currentMonthEnd;
                    });
                }

                const categoryTotals = filteredExpenses.reduce((acc, expense) => {
                    const { category, amount } = expense;
                    if (!category) return acc;
                    if (!acc[category]) {
                        acc[category] = 0;
                    }
                    acc[category] += amount;
                    return acc;
                }, {});

                const sortedCategories = Object.entries(categoryTotals)
                    .map(([category, amount]) => ({ category, amount }))
                    .sort((a, b) => b.amount - a.amount);

                const topThreeCategories = sortedCategories.slice(0, 3);
                setTopCategories(topThreeCategories);
            } catch (error) {
                console.error('Error fetching top categories:', error);
            }
        };

        fetchTopCategories();
    }, [interval]);

    return (
        <div className='diagram-container' style={{ width: "50%", textAlign: 'center' }}>
            <div>
                <h1>Top Categories</h1>
                {topCategories.length > 0 ? (
                    <ResponsiveContainer width="100%" height={150}>
                        <BarChart data={topCategories}>
                            <XAxis dataKey="category" />
                            <Tooltip />
                            <Bar dataKey="amount" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <p>Loading chart...</p>
                )}
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
                    Overall
                </button>
            </div>
        </div>
    );
}
