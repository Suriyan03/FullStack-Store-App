import React, { useState } from 'react';
import api from '../api';

function ChangePasswordForm() {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            const response = await api.put('/user/password', formData);
            setMessage(response.data.message);
            setFormData({ currentPassword: '', newPassword: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to change password.');
        }
    };

    return (
        <div>
            <h2>Change Password</h2>
            <form onSubmit={handleSubmit}>
                <input type="password" name="currentPassword" placeholder="Current Password" value={formData.currentPassword} onChange={handleChange} required />
                <input type="password" name="newPassword" placeholder="New Password" value={formData.newPassword} onChange={handleChange} required />
                <button type="submit">Change Password</button>
            </form>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}

export default ChangePasswordForm;