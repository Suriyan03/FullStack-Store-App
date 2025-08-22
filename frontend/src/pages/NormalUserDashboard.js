import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import ChangePasswordForm from '../components/ChangePasswordForm';

function NormalUserDashboard() {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('stores'); // New state for active tab
    const navigate = useNavigate();

    const fetchStores = async () => {
        try {
            const response = await api.get('/normal-user/stores');
            setStores(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to load stores. Please try again.');
            setLoading(false);
            console.error(err);
        }
    };

    useEffect(() => {
        fetchStores();
    }, []);

    const handleRatingSubmit = async (storeId, rating) => {
        try {
            await api.post('/normal-user/ratings', { storeId, rating });
            alert('Rating submitted successfully!');
            fetchStores();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to submit rating.');
        }
    };

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
                <h1>Normal User Dashboard</h1>
                <button onClick={handleLogout} className="logout-btn">Log Out</button>
            </div>
            
            {/* Tab Navigation */}
            <div className="tab-navigation">
                <button 
                    className={`tab-button ${activeTab === 'stores' ? 'active' : ''}`} 
                    onClick={() => setActiveTab('stores')}
                >
                    Available Stores
                </button>
                <button 
                    className={`tab-button ${activeTab === 'password' ? 'active' : ''}`} 
                    onClick={() => setActiveTab('password')}
                >
                    Change Password
                </button>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
                {activeTab === 'stores' && (
                    <div className="store-list-container">
                        {stores.length > 0 ? (
                            stores.map(store => (
                                <div key={store.id} className="store-card">
                                    <h3>{store.name}</h3>
                                    <p>Address: {store.address}</p>
                                    <p>Overall Rating: {store.overall_rating ? parseFloat(store.overall_rating).toFixed(1) : 'No ratings yet'}</p>
                                    <p>Your Rating: {store.user_submitted_rating || 'Not rated'}</p>
                                    <div>
                                        <h4>Submit a Rating (1-5):</h4>
                                        {[1, 2, 3, 4, 5].map(ratingValue => (
                                            <button
                                                key={ratingValue}
                                                onClick={() => handleRatingSubmit(store.id, ratingValue)}
                                                style={{ backgroundColor: store.user_submitted_rating === ratingValue ? '#007bff' : 'white', color: store.user_submitted_rating === ratingValue ? 'white' : '#007bff' }}
                                            >
                                                {ratingValue}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No stores available at the moment.</p>
                        )}
                    </div>
                )}

                {activeTab === 'password' && (
                    <ChangePasswordForm />
                )}
            </div>
        </div>
    );
}

const logoutButtonStyle = {
    padding: '10px 20px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
};

export default NormalUserDashboard;