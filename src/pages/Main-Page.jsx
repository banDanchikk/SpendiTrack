import React, { useEffect, useState } from 'react';
import '../index.css';
import Expances from '../components/Expances';
import Menu from '../components/Menu';
import MonthPlan from '../components/MonthPlan';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';

export default function MainPage() {
    const [user, setUser] = useState(null);
    const [profInfo, setProfInfo] = useState({ emoji: '🥸', color: 'transpearent' });
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                navigate('/login');
            }
        });

        return () => unsubscribe();
    }, [navigate]);
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (!user) {
                    console.warn('User is not logged in.');
                    return;
                }

                const userDocRef = doc(firestore, 'users', user.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    const data = userDoc.data();
                    setProfInfo({
                        emoji: data.emoji || '🥸',
                        color: data.color || 'white',
                    });
                } else {
                    console.warn('User data not found.');
                }
            } catch (error) {
                console.error('Error fetching user data: ', error);
            }
        };

        if (user) {
            fetchUserData();
        }
    }, [user]);

    if (!user) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    width: '100%',
                }}
            >
                <div
                    className="profile-pic"
                    style={{
                        backgroundColor: profInfo.color,
                        fontSize: '3em',
                        width: '1.75em',
                        height: '1.75em',
                        borderRadius: '50%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize:'2em'
                    }}
                >
                    <Link
                        to="/profile"
                        style={{
                            textDecoration: 'none',
                            color: 'inherit', 
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: '1em',
                        }}
                    >
                        {profInfo.emoji}
                    </Link>
                </div>
            </div>
            <div style={{ padding: '2em' }}>
                <MonthPlan />
            </div>
            <Expances />
            <Menu />
        </div>
    );
}
