import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

function StoreList() {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sort, setSort] = useState('name');
    const [order, setOrder] = useState('ASC');
    
    // For handling navigation and logout
    const navigate = useNavigate();

    const fetchStores = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/admin/stores?sort=${sort}&order=${order}&name=${searchTerm}`);
            setStores(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch store data. Please try again.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStores();
    }, [sort, order, searchTerm]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/');
    };

    if (loading) return <div>Loading stores...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Manage Stores</h2>
                <button onClick={handleLogout} className="logout-btn">Log Out</button>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={() => setOrder(order === 'ASC' ? 'DESC' : 'ASC')} style={{ marginLeft: '10px' }}>
                    Sort by Name ({order})
                </button>
            </div>
            
            <table className="user-table">
                <thead>
                    <tr>
                        <th>Store Name</th>
                        <th>Address</th>
                        <th>Average Rating</th>
                        <th>Owner Email</th>
                    </tr>
                </thead>
                <tbody>
                    {stores.map(store => (
                        <tr key={store.id}>
                            <td>{store.name}</td>
                            <td>{store.address}</td>
                            <td>{store.avg_rating ? parseFloat(store.avg_rating).toFixed(1) : 'N/A'}</td>
                            <td>{store.owner_email}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default StoreList;