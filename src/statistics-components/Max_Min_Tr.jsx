import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { firestore, auth } from '../firebase';

export default function Max_Min_Tr() {
    const [maxMonthTransaction, setMaxMonthTransaction] = useState(null);
    const [maxAllTimeTransaction, setMaxAllTimeTransaction] = useState(null);
    const [minMonthTransaction, setMinMonthTransaction] = useState(null);
    const [minAllTimeTransaction, setMinAllTimeTransaction] = useState(null);
    const [interval, setInterval] = useState(false); 

    useEffect(() => {
        const fetchUserExpenses = async () => {
            try {
                const user = auth.currentUser;

                if (!user) {
                    console.error("No user is logged in.");
                    return;
                }

               
                const userDocRef = doc(firestore, 'users', user.uid); 
                const userDocSnapshot = await getDoc(userDocRef);

                if (!userDocSnapshot.exists()) {
                    console.error("No expenses found for the logged-in user.");
                    return;
                }

                const userData = userDocSnapshot.data();
                const transactions = userData.expenses || []; 

                const now = new Date();
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

               
                const currentMonthTransactions = transactions.filter((transaction) => {
                    const transactionDate = new Date(transaction.date);
                    return transactionDate >= startOfMonth && transactionDate <= endOfMonth;
                });

                
                const maxMonth = currentMonthTransactions.reduce(
                    (max, transaction) => (transaction.amount > (max?.amount || 0) ? transaction : max),
                    null
                );

                const minMonth = currentMonthTransactions.reduce(
                    (min, transaction) => (transaction.amount < (min?.amount || Infinity) ? transaction : min),
                    null
                );

                const maxAllTime = transactions.reduce(
                    (max, transaction) => (transaction.amount > (max?.amount || 0) ? transaction : max),
                    null
                );

                const minAllTime = transactions.reduce(
                    (min, transaction) => (transaction.amount < (min?.amount || Infinity) ? transaction : min),
                    null
                );

                setMaxMonthTransaction(maxMonth);
                setMinMonthTransaction(minMonth);
                setMaxAllTimeTransaction(maxAllTime);
                setMinAllTimeTransaction(minAllTime);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };

        fetchUserExpenses();
    }, []);

    const displayTransaction = interval
        ? (maxMonthTransaction && minMonthTransaction ? minMonthTransaction : null)
        : (maxMonthTransaction && maxAllTimeTransaction ? maxMonthTransaction : null);

    const displayAllTimeTransaction = interval
        ? (maxAllTimeTransaction && minAllTimeTransaction ? minAllTimeTransaction : null)
        : (maxAllTimeTransaction && maxAllTimeTransaction ? maxAllTimeTransaction : null);

    return (
        <div className="diagram-container" style={{ width: "100%", textAlign: 'center' }}>
            <h1>Transactions Info</h1>
            {displayTransaction && displayAllTimeTransaction ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <div style={{ marginBottom: '2em', textAlign: 'center' }}>
                        <h2>{interval ? "Min Transaction This Month" : "Max Transaction This Month"}</h2>
                        <div style={{ display: 'flex', flexDirection: 'row', gap: '2em', justifyContent: 'center', alignItems: 'center' }}>
                            <p><strong>Date:</strong> {new Date(displayTransaction.date).toLocaleDateString()}</p>
                            <p><strong>Amount:</strong> {displayTransaction.amount.toFixed(2)}</p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'row', gap: '2em', justifyContent: 'center', alignItems: 'center' }}>
                            <p><strong>Category:</strong> {displayTransaction.category || 'No category'}</p>
                            <p><strong>Description:</strong> {displayTransaction.comment || 'No description'}</p>
                        </div>
                    </div>
                    <div>
                        <h2>{interval ? "Min Transaction All Time" : "Max Transaction All Time"}</h2>
                        <div style={{ display: 'flex', flexDirection: 'row', gap: '2em', justifyContent: 'center', alignItems: 'center' }}>
                            <p><strong>Date:</strong> {new Date(displayAllTimeTransaction.date).toLocaleDateString()}</p>
                            <p><strong>Amount:</strong> {displayAllTimeTransaction.amount.toFixed(2)}</p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'row', gap: '2em', justifyContent: 'center', alignItems: 'center' }}>
                            <p><strong>Category:</strong> {displayAllTimeTransaction.category || 'No category'}</p>
                            <p><strong>Description:</strong> {displayAllTimeTransaction.comment || 'No description'}</p>
                        </div>
                    </div>
                </div>
            ) : (
                <p>Loading data...</p>
            )}
            <div className="btn-container">
                <button
                    className={interval ? 'date-btn-clicked' : 'date-btn'}
                    onClick={() => setInterval(true)}
                >
                    Min
                </button>
                <button
                    className={!interval ? 'date-btn-clicked' : 'date-btn'}
                    onClick={() => setInterval(false)}
                >
                    Max
                </button>
            </div>
        </div>
    );
}
