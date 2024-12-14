import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { auth, firestore } from '../firebase';
import {
    AreaChart,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area
} from 'recharts';

export default function MonthDiagram() {
    const [expenses, setExpenses] = useState([]);
    const [interval, setInterval] = useState(true);

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const user = auth.currentUser;

                if (!user) {
                    console.log("No user is logged in.");
                    return;
                }

                const userDocRef = doc(firestore, 'users', user.uid);
                const userDoc = await getDoc(userDocRef);

                if (!userDoc.exists()) {
                    console.error("No expenses found for the logged-in user.");
                    return;
                }

                const userData = userDoc.data();
                const expensesList = userData.expenses || [];

                const now = new Date();
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                const startOfYear = new Date(now.getFullYear(), 0, 1);
                const endOfYear = new Date(now.getFullYear() + 1, 0, 0);

                const filteredExpenses = expensesList.filter((expense) => {
                    const expenseDate = new Date(expense.date);
                    if (interval) {
                        return expenseDate >= startOfMonth && expenseDate <= endOfMonth;
                    } else {
                        return expenseDate >= startOfYear && expenseDate <= endOfYear;
                    }
                });

                setExpenses(filteredExpenses);
            } catch (error) {
                console.error('Error fetching expenses: ', error);
            }
        };

        fetchExpenses();
    }, [interval]);

    const groupedExpenses = expenses.reduce((acc, expense) => {
        const { date, amount } = expense;
        const expenseDate = new Date(date);

        let key;

        if (interval) {
            const day = String(expenseDate.getDate()).padStart(2, '0');
            const month = String(expenseDate.getMonth() + 1).padStart(2, '0');
            key = `${month}-${day}`;
        } else {
            const month = String(expenseDate.getMonth() + 1).padStart(2, '0');
            const year = expenseDate.getFullYear();
            key = `${year}-${month}`;
        }

        if (!acc[key]) {
            acc[key] = 0;
        }
        acc[key] += amount;
        return acc;
    }, {});

    const data = Object.keys(groupedExpenses)
        .sort((a, b) => {
            const dateA = new Date(interval ? `2023-${a}` : a);
            const dateB = new Date(interval ? `2023-${b}` : b);
            return dateA - dateB;
        })
        .map((key) => ({
            name: key,
            amount: groupedExpenses[key],
        }));

    return (
        <div className='diagram-container'>
            <h1>Expenses for a certain period</h1>
            <ResponsiveContainer width="100%" height={200} style={{ marginTop: '3em', padding: '2em', paddingRight: '3em' }}>
                <AreaChart
                    width={500}
                    height={200}
                    data={data}
                    syncId="anyId"
                    margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="amount" stroke="#82ca9d" fill="#82ca9d" />
                </AreaChart>
            </ResponsiveContainer>
            <div className='btn-container' style={{ marginTop: '6.5em' }}>
                <button className={interval ? 'date-btn-clicked' : 'date-btn'} onClick={() => setInterval(true)}>
                    Month
                </button>
                <button className={!interval ? 'date-btn-clicked' : 'date-btn'} onClick={() => setInterval(false)}>
                    Year
                </button>
            </div>
        </div>
    );
}
