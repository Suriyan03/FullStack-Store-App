import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import AdminDashboard from './components/AdminDashboard';
import NormalUserDashboard from './pages/NormalUserDashboard';
import StoreOwnerDashboard from './pages/StoreOwnerDashboard'; // New import
import UserList from './components/UserList';
import StoreList from './components/StoreList';
import AddUserForm from './components/AddUserForm';
import AddStoreForm from './components/AddStoreForm';
import './App.css'; 

const ProtectedRoute = ({ children, requiredRole }) => {
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');
    
    if (!token || role !== requiredRole) {
        return <Navigate to="/" replace />;
    }
    return children;
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/register" element={<RegistrationPage />} />
                
                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={<ProtectedRoute requiredRole="system_admin"><AdminDashboard /></ProtectedRoute>} />
                <Route path="/admin/users" element={<ProtectedRoute requiredRole="system_admin"><UserList /></ProtectedRoute>} />
                <Route path="/admin/stores" element={<ProtectedRoute requiredRole="system_admin"><StoreList /></ProtectedRoute>} />
                <Route path="/admin/add-user" element={<ProtectedRoute requiredRole="system_admin"><AddUserForm /></ProtectedRoute>} />
                <Route path="/admin/add-store" element={<ProtectedRoute requiredRole="system_admin"><AddStoreForm /></ProtectedRoute>} />

                {/* Normal User Routes */}
                <Route path="/user/stores" element={<ProtectedRoute requiredRole="normal_user"><NormalUserDashboard /></ProtectedRoute>} />

                {/* Store Owner Routes */}
                <Route path="/store-owner/dashboard" element={<ProtectedRoute requiredRole="store_owner"><StoreOwnerDashboard /></ProtectedRoute>} />
            </Routes>
        </Router>
    );
}

export default App;