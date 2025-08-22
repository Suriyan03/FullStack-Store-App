import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, role } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('role', role);

            if (role === 'system_admin') {
                navigate('/admin/dashboard');
            } else if (role === 'normal_user') {
                navigate('/user/stores');
            } else if (role === 'store_owner') {
                navigate('/store-owner/dashboard');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="login-page-container">
            <div className="container">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <button type="submit">Log In</button>
                </form>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <p>Don't have an account? <Link to="/register">Sign Up</Link></p>
            </div>
        </div>
    );
}

export default LoginPage;