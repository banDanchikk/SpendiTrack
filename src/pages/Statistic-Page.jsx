import React, { useEffect, useState } from 'react';
import Menu from '../components/Menu'
import { useNavigate, Link } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebase';
import CategoriesDiagram from '../statistics-components/Categories-Diagram';
import MonthDiagram from '../statistics-components/Month-Diagram';
import Awg_Per_Month from '../statistics-components/Awg-Per-Month';
import Fav_Cat from '../statistics-components/Fav-Cat';
import Min_Max from '../statistics-components/Min-Max';
import Max_Min_Tr from '../statistics-components/Max_Min_Tr';


export default function StatisticPage() {
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
                    color: data.color,
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
    <>
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
      <div className="top-diagrams">
        <CategoriesDiagram />
        <MonthDiagram />
      </div>
      <div className="top-diagrams" style={{paddingLeft:'3em', paddingRight:'3em'}}>
        <Awg_Per_Month />
        <Min_Max/>
        
      </div>
      <div className="top-diagrams" style={{paddingLeft:'3em', paddingRight:'3em', marginBottom:'5em'}}>
        <Max_Min_Tr/>
        <Fav_Cat/>
      </div>
      
      <Menu />
    </>
  )
}
