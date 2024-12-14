import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { firestore, auth } from '../firebase';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, Tooltip, ResponsiveContainer, PolarRadiusAxis } from 'recharts';

export default function Fav_Cat() {
    const [monthlyAverages, setMonthlyAverages] = useState([]);

    useEffect(() => {
        const fetchMonthlyAverages = async () => {
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
                const currentYear = now.getFullYear();

                const expensesThisYear = expensesList.filter((expense) => {
                    const expenseDate = new Date(expense.date);
                    return expenseDate.getFullYear() === currentYear;
                });

                const monthlyTotals = expensesThisYear.reduce((acc, expense) => {
                    const expenseDate = new Date(expense.date);
                    const month = expenseDate.getMonth();
                    if (!acc[month]) {
                        acc[month] = { total: 0, daysWithExpenses: new Set() };
                    }
                    acc[month].total += expense.amount;
                    acc[month].daysWithExpenses.add(expenseDate.getDate());
                    return acc;
                }, {});

                const averages = Object.keys(monthlyTotals).map((month) => {
                    const { total, daysWithExpenses } = monthlyTotals[month];
                    return {
                        month: new Date(currentYear, month, 1).toLocaleString('en-US', { month: 'short' }),
                        average: (total / daysWithExpenses.size).toFixed(2),
                    };
                });

                setMonthlyAverages(averages);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchMonthlyAverages();
    }, []);

    return (
        <div className='diagram-container' style={{ width: "100%" }}>
            <h1>Average expenses per month</h1>
            {monthlyAverages.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={monthlyAverages}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="month" />
                        <PolarRadiusAxis 
                            angle={45}
                            domain={[0, Math.max(...monthlyAverages.map(d => d.average))]}
                        />
                        <Tooltip />
                        <Radar 
                            name="Середні витрати" 
                            dataKey="average" 
                            stroke="#8884d8" 
                            fill="#8884d8" 
                            fillOpacity={0.6} 
                        />
                    </RadarChart>
                </ResponsiveContainer>
            ) : (
                <p>Loading diagram...</p>
            )}
        </div>
    );
}
