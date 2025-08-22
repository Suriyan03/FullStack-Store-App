import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

function UserList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sort, setSort] = useState('name');
    const [order, setOrder] = useState('ASC');
    
    // For handling navigation and logout
    const navigate = useNavigate();

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/admin/users?sort=${sort}&order=${order}&name=${searchTerm}`);
            setUsers(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch user data. Please try again.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [sort, order, searchTerm]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/');
    };

    if (loading) return <div>Loading users...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Manage Users</h2>
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
                        <th>Name</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>Role</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.address}</td>
                            <td>{user.role}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default UserList;