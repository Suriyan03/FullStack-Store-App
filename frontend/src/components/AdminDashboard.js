import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import UserList from './UserList';
import StoreList from './StoreList';
import AddUserForm from './AddUserForm';
import AddStoreForm from './AddStoreForm';

function AdminDashboard() {
    const [metrics, setMetrics] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
    const [activeView, setActiveView] = useState('dashboard'); // New state for tabs
    const navigate = useNavigate();

    const fetchMetrics = async () => {
        try {
            const response = await api.get('/admin/dashboard');
            setMetrics(response.data);
        } catch (error) {
            console.error('Failed to fetch dashboard metrics:', error);
        }
    };

    useEffect(() => {
        fetchMetrics();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/');
    };

    const renderContent = () => {
        switch (activeView) {
            case 'dashboard':
                return (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' }}>
                        <div className="dashboard-card">
                            <h3>Total Users</h3>
                            <p>{metrics.totalUsers}</p>
                        </div>
                        <div className="dashboard-card">
                            <h3>Total Stores</h3>
                            <p>{metrics.totalStores}</p>
                        </div>
                        <div className="dashboard-card">
                            <h3>Total Ratings</h3>
                            <p>{metrics.totalRatings}</p>
                        </div>
                    </div>
                );
            case 'users':
                return <UserList />;
            case 'stores':
                return <StoreList />;
            case 'add-user':
                return <AddUserForm />;
            case 'add-store':
                return <AddStoreForm />;
            default:
                return null;
        }
    };

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                <h1>Admin Dashboard</h1>
                <button onClick={handleLogout} className="logout-btn">Log Out</button>
            </div>

            <div className="tab-navigation" style={{ flexWrap: 'wrap' }}>
                <button 
                    className={`tab-button ${activeView === 'dashboard' ? 'active' : ''}`}
                    onClick={() => setActiveView('dashboard')}
                >
                    Dashboard
                </button>
                <button 
                    className={`tab-button ${activeView === 'users' ? 'active' : ''}`}
                    onClick={() => setActiveView('users')}
                >
                    Manage Users
                </button>
                <button 
                    className={`tab-button ${activeView === 'stores' ? 'active' : ''}`}
                    onClick={() => setActiveView('stores')}
                >
                    Manage Stores
                </button>
                <button 
                    className={`tab-button ${activeView === 'add-user' ? 'active' : ''}`}
                    onClick={() => setActiveView('add-user')}
                >
                    Add New User
                </button>
                <button 
                    className={`tab-button ${activeView === 'add-store' ? 'active' : ''}`}
                    onClick={() => setActiveView('add-store')}
                >
                    Add New Store
                </button>
            </div>
            
            <div className="tab-content">
                {renderContent()}
            </div>
        </div>
    );
}

export default AdminDashboard;