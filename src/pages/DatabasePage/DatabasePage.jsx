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
      { id: 22760, member: 'Neha Kumari', overdue: '4 days', fines: 'Rs120.00' },
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
      <header className="page-header">
        <img src={logo} alt="Athenaeum Logo" className="logo" />
        <h1>Library Management Dashboard</h1>
      </header>

      <div className="dashboard-container">
        <div className="dashboard-grid">
          <div className="dashboard-card stats-card">
            <div className="card-header">
              <h3>Library Statistics</h3>
              <span className="card-icon">📊</span>
            </div>
            <div className="stats-container">
              <div className="stats-input">
                <label>Active Borrowers:</label>
                <input
                  type="number"
                  value={stats.borrowers}
                  onChange={(e) => handleUpdateStats('borrowers', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>

          <div className="dashboard-card overview-card">
            <div className="card-header">
              <h3>Borrowing Overview</h3>
              <span className="card-icon">📚</span>
            </div>
            <div className="overdue-count">
              <div className="stats-input">
                <label>Books Borrowed:</label>
                <input
                  type="number"
                  value={stats.borrowedCount}
                  onChange={(e) => handleUpdateStats('borrowedCount', parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="overdue-indicator">
                <span className="count-badge">{overdueBooks.length}</span>
                <span>Overdue Books</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="overdue-books-container">
        <div className="section-header">
          <h2>Overdue Book Management</h2>
          <p>Manage and track overdue books and fines</p>
        </div>

        <div className="add-overdue-form">
          <h3>Add New Overdue Entry</h3>
          <div className="form-row">
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
          </div>
          <button
            className="add-button"
            onClick={handleAddOverdue}
            disabled={!newOverdue.member || !newOverdue.overdue || !newOverdue.fines}
          >
            Add Entry
          </button>
        </div>

        <div className="table-container">
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
                  <td><span className="overdue-badge">{book.overdue}</span></td>
                  <td className="fines-amount">{book.fines}</td>
                  <td>
                  <button className="delete-button 1" onClick={() => handleDeleteOverdue(book.id)}>
                    <span className="text">Delete</span>
                     <span className="icon">
                     <svg viewBox="0 0 24 24" width="24" height="24">
                      <path d="M3 6v18h18v-18h-18zm5 14c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4-18v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2h5.712z"/>
                     </svg>
                    </span>
                  </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <button className="back-button" onClick={() => navigate('/catalog')}>
        Back to Catalog
      </button>
    </div>
  );
};

export default DatabasePage;