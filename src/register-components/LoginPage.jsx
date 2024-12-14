import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { Link } from 'react-router-dom';
import Eye from '../images/eye.png'
import ClosedEye from '../images/eye-crossed.png'

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/');
        } catch (err) {
            if (err.code === 'auth/invalid-email') {
                setError('Invalid email format.');
            } else if (err.code === 'auth/user-not-found') {
                setError('User not found. Please register.');
            } else if (err.code === 'auth/wrong-password') {
                setError('Incorrect password. Please try again.');
            } else {
                setError('An error occurred. Please try again.');
            }
        }
    };

    return (
        <form className='reg-log-container' onSubmit={handleLogin}>
            <h1 style={{marginBottom:'1px'}}>Login</h1>
            <p style={{fontSize:'1.5em'}}>Sign in to your account</p>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <div style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    width: '74%',
                }}>
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
            <button className ='reg-log-btn' type="submit">Login</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <p>Don't have an account? <Link to="/register" style={{color:'blue', marginTop:'10px'}}> Register here</Link></p>
        </form>
    );
}
