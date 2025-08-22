import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import ChangePasswordForm from '../components/ChangePasswordForm';

function StoreOwnerDashboard() {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('dashboard'); // New state for tabs
    const navigate = useNavigate();

    const fetchDashboardData = async () => {
        try {
            const response = await api.get('/store-owner/dashboard');
            setDashboardData(response.data);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load dashboard data.');
            setLoading(false);
            console.error(err);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/');
    };

    if (loading) {
        return <div>Loading dashboard...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Store Owner Dashboard</h1>
                <button onClick={handleLogout} className="logout-btn">Log Out</button>
            </div>
            
            {/* Tab Navigation */}
            <div className="tab-navigation">
                <button 
                    className={`tab-button ${activeTab === 'dashboard' ? 'active' : ''}`} 
                    onClick={() => setActiveTab('dashboard')}
                >
                    Dashboard
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
                {activeTab === 'dashboard' && (
                    <div>
                        <h2>Your Store's Performance</h2>
                        <div className="dashboard-card" style={{ maxWidth: '300px' }}>
                            <h3>Average Rating</h3>
                            <p style={{ fontSize: '2em', fontWeight: 'bold' }}>
                                {parseFloat(dashboardData.averageRating).toFixed(1)} / 5
                            </p>
                        </div>

                        <h2 style={{marginTop: '40px'}}>Users Who Rated Your Store</h2>
                        {dashboardData.usersWhoRated.length > 0 ? (
                            <table>
                                <thead>
                                    <tr>
                                        <th>User Name</th>
                                        <th>User Email</th>
                                        <th>Rating</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dashboardData.usersWhoRated.map((user, index) => (
                                        <tr key={index}>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>{user.rating}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No ratings have been submitted for your store yet.</p>
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

export default StoreOwnerDashboard;