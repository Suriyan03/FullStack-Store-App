import React, { useState } from 'react';
import api from '../api';

function AddStoreForm() {
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        ownerId: ''
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
            const response = await api.post('/admin/stores', { ...formData, ownerId: parseInt(formData.ownerId) });
            setMessage(response.data.message);
            setFormData({ name: '', address: '', ownerId: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add store. Check the server logs.');
        }
    };

    return (
        <div>
            <h2>Add New Store</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Store Name" value={formData.name} onChange={handleChange} required />
                <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
                <input type="number" name="ownerId" placeholder="Store Owner User ID" value={formData.ownerId} onChange={handleChange} required />
                <button type="submit">Add Store</button>
            </form>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}

export default AddStoreForm;