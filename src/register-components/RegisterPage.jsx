import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth, firestore } from '../firebase';
import { setDoc, doc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import '../index.css';
import Eye from '../images/eye.png'
import ClosedEye from '../images/eye-crossed.png'

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false); 
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password.length < 8) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const { uid } = userCredential.user;

            await setDoc(doc(firestore, 'users', uid), {
                username: name,
                email: email,
                expenses: [],
                monthLimit: 0,
                phone: '',
                color: '',
                date: '',
                avatar: '',
            });

            navigate('/');
        } catch (err) {
            console.error('Registration error:', err.message);
            setError(`Error during registration: ${err.message}`);
        }
    };

    return (
        <form className="reg-log-container" onSubmit={handleRegister}>
            <div className="form-container">
                <h1 style={{marginBottom:'1px'}}>Register</h1>
                <p style={{ fontSize: '1.5em' }}>Create your account</p>
                <input
                    type="text"
                    placeholder="Username"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <div style={{ position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        width: '74%', }}>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{
                            width: '100%',
                        }}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                            position: 'absolute',
                            right: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '1em',
                            paddingLeft:'10px',
                            paddingRight:'10px'
                        }}
                    >
                        <img
                            src={showPassword ? Eye : ClosedEye}
                            alt={showPassword ? 'Hide password' : 'Show password'}
                            style={{
                                width: '20px',
                                height: '20px',
                            }}
                        />
                    </button>
                </div>
                <button className="reg-log-btn" type="submit">Sign Up</button>
                {error && <p style={{ color: 'red' }}>An error occurred. Please try again.</p>}
                <p>
                    I already have an account.
                    <Link to="/login" style={{ color: 'blue', marginLeft: '5px' }}>Click here</Link>
                </p>
            </div>
        </form>
    );
}
