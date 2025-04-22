import React, { useState, useEffect } from 'react';
import './DatabasePage.css';
import { useNavigate } from 'react-router-dom';
import logo from './logo.jpg';

const DatabasePage = () => {
  const navigate = useNavigate();
  const [overdueBooks, setOverdueBooks] = useState(() => {
    const saved = localStorage.getItem('overdueBooks');
    return saved ? JSON.parse(saved) : [
      { id: 22982, member: 'Amit Raj', overdue: '3 days', fines: 'Rs100.00' },
      { id: 22818, member: 'Keahav Raj', overdue: '3 days', fines: 'Rs100.00' },
      { id: 22760, member: 'Neha Kumari', overdue: '4 days', fines: 'Rs120.00' }
    ];
  });

  const [newOverdue, setNewOverdue] = useState({
    member: '',
    overdue: '',
    fines: ''
  });

  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('libraryStats');
    return saved ? JSON.parse(saved) : {
      borrowedCount: 14,
      visitors: 24303,
      borrowers: 1200
    };
  });

  useEffect(() => {
    localStorage.setItem('overdueBooks', JSON.stringify(overdueBooks));
    localStorage.setItem('libraryStats', JSON.stringify(stats));
  }, [overdueBooks, stats]);

  const handleAddOverdue = () => {
    if (!newOverdue.member || !newOverdue.overdue || !newOverdue.fines) return;

    const newEntry = {
      id: Date.now(),
      ...newOverdue
    };
    setOverdueBooks([...overdueBooks, newEntry]);
    setNewOverdue({ member: '', overdue: '', fines: '' });
    setStats(prev => ({
      ...prev,
      borrowedCount: prev.borrowedCount + 1
    }));
  };

  const handleDeleteOverdue = (id) => {
    if (window.confirm('Are you sure you want to delete this overdue record?')) {
      setOverdueBooks(overdueBooks.filter(book => book.id !== id));
      setStats(prev => ({
        ...prev,
        borrowedCount: Math.max(0, prev.borrowedCount - 1)
      }));
    }
  };

  const handleUpdateStats = (field, value) => {
    setStats(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="database-page">
      <img src={logo} alt="Athenaeum Logo" className="logo" />

      <div className="dashboard-container">
        <h1>Dashboard</h1>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Borrowed books</h3>
            <div className="stats-container">
              <div className="stats-input">
                <label>Visitors:</label>
                <input
                  type="number"
                  value={stats.visitors}
                  onChange={(e) => handleUpdateStats('visitors', parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="stats-input">
                <label>Borrowers:</label>
                <input
                  type="number"
                  value={stats.borrowers}
                  onChange={(e) => handleUpdateStats('borrowers', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <h3>Overview</h3>
            <div className="overdue-count">
              <p>Overdue books</p>
              <div className="stats-input">
                <input
                  type="number"
                  value={stats.borrowedCount}
                  onChange={(e) => handleUpdateStats('borrowedCount', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <h3>Library visitors</h3>
            <h2>{stats.visitors.toLocaleString()}</h2>
          </div>
        </div>
      </div>

      <div className="overdue-books-container">
        <h1>Overdue Book List</h1>

        <div className="add-overdue-form">
          <h3>Add New Overdue Entry</h3>
          <div className="form-group">
            <input
              type="text"
              placeholder="Member name"
              value={newOverdue.member}
              onChange={(e) => setNewOverdue({ ...newOverdue, member: e.target.value })}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Overdue period (e.g., 3 days)"
              value={newOverdue.overdue}
              onChange={(e) => setNewOverdue({ ...newOverdue, overdue: e.target.value })}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Fines amount (e.g., Rs100.00)"
              value={newOverdue.fines}
              onChange={(e) => setNewOverdue({ ...newOverdue, fines: e.target.value })}
            />
          </div>
          <button
            className="add-button"
            onClick={handleAddOverdue}
            disabled={!newOverdue.member || !newOverdue.overdue || !newOverdue.fines}
          >
            Add Entry
          </button>
        </div>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>MEMBER</th>
              <th>OVERDUE</th>
              <th>FINES</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {overdueBooks.map(book => (
              <tr key={book.id}>
                <td>#{book.id}</td>
                <td>{book.member}</td>
                <td>{book.overdue}</td>
                <td>{book.fines}</td>
                <td>
                  <button className="delete-button" onClick={() => handleDeleteOverdue(book.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="back-button" onClick={() => navigate('/catalog')}>
        Back to Catalog
      </button>
    </div>
  );
};

export default DatabasePage;
