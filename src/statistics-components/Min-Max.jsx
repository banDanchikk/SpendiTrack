import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { firestore, auth } from '../firebase';

export default function DaysWithoutExpenses() {
    const [daysWithoutExpensesMonth, setDaysWithoutExpensesMonth] = useState(0);
    const [daysWithoutExpensesAllTime, setDaysWithoutExpensesAllTime] = useState(0);

    useEffect(() => {
        const fetchDaysWithoutExpenses = async () => {
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
                const currentDay = now.getDate();

                const expensesThisMonth = expensesList.filter((expense) => {
                    const expenseDate = new Date(expense.date);
                    return expenseDate >= startOfMonth && expenseDate <= now;
                });

                const daysWithExpensesMonth = [...new Set(expensesThisMonth.map(expense => {
                    const expenseDate = new Date(expense.date);
                    return expenseDate.getDate();
                }))];

                const allDaysInMonth = Array.from({ length: currentDay }, (_, i) => i + 1);
                const daysWithoutMonth = allDaysInMonth.filter(day => !daysWithExpensesMonth.includes(day));
                setDaysWithoutExpensesMonth(daysWithoutMonth.length);

                const startOfYear = new Date(now.getFullYear(), 0, 1);
                const expensesThisYear = expensesList.filter((expense) => {
                    const expenseDate = new Date(expense.date);
                    return expenseDate >= startOfYear && expenseDate <= now;
                });

                const daysWithExpensesYear = [...new Set(expensesThisYear.map(expense => {
                    const expenseDate = new Date(expense.date);
                    return expenseDate.toLocaleDateString();
                }))];

                const allPossibleDays = [];
                for (let d = new Date(startOfYear); d <= now; d.setDate(d.getDate() + 1)) {
                    allPossibleDays.push(d.toLocaleDateString());
                }

                const daysWithoutAllTime = allPossibleDays.filter(day => !daysWithExpensesYear.includes(day));
                setDaysWithoutExpensesAllTime(daysWithoutAllTime.length);

            } catch (error) {
                console.error('Помилка при отриманні даних про дні без витрат:', error);
            }
        };

        fetchDaysWithoutExpenses();
    }, []);

    return (
        <div className='diagram-container' style={{ width: "50%", display: 'flex', alignItems: 'center', textAlign: 'center' }}>
            <h1>Days Without Expenses</h1>
            <div>
                <h2>This Month</h2>
                <p><strong>{daysWithoutExpensesMonth}</strong> days without any expenses this month.</p>
            </div>
            <div style={{ marginTop: '1em' }}>
                <h2>This Year</h2>
                <p><strong>{daysWithoutExpensesAllTime}</strong> days without any expenses this year.</p>
            </div>
        </div>
    );
}
