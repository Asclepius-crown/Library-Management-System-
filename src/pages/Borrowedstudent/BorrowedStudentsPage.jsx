import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BorrowedStudentsPage.css';
import logo from './logo.jpg';
  

const BorrowedStudentsPage = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate('/login');
  };

  const [borrowedBooks] = useState([
    {
      id: 1,
      studentName: 'Raja Kumar',
      studentId: 'GECB123',
      bookTitle: 'Let Us C',
      borrowDate: '04/01/2025',
      dueDate: '04/05/2025',
      returnStatus: 'Overdue'
    },
    {
      id: 2,
      studentName: 'Akshay Kumar',
      studentId: 'GECB234',
      bookTitle: 'Math',
      borrowDate:'04/01/2024',
      dueDate: '04/05/2025',
      returnStatus: 'Returned'
    },
    {
      id: 3,
      studentName: 'Kundan Kumar',
      studentId: 'GECB345',
      bookTitle: 'Data Structures',
      borrowDate: '04/01/2025',
      dueDate: '04/02/2025',
      returnStatus: 'Returned'
    },
    {
      id: 4,
      studentName: 'Sonu Kumar',
      studentId: 'GEC$%^',
      bookTitle: 'Digital Logic',
      borrowDate: '04/01/2025',
      dueDate: '04/04/2025',
      returnStatus: 'Not Returned'
    }
  ]);

  const filteredBooks = borrowedBooks.filter(book =>
    `${book.studentName} ${book.studentId} ${book.bookTitle}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const getStatusClass = (status) => {
    switch (status) {
      case 'Overdue': return 'status-overdue';
      case 'Returned': return 'status-returned';
      case 'Not Returned': return 'status-not-returned';
      default: return '';
    }
  };

  return (
    <div className="borrowed-students-page">
      <div className="header-section">
        <div className="header-left">
          <img src={logo} alt="Athenaeum Logo" className="logo" />
          <h1 className="app-title">Athenaeum</h1>
        </div>
        <button className="logout-button" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>

      <div className="main-content">
        <div className="sidebar">
          <div className="sidebar-section">
            <h3>Projects</h3>
            <ul>
              <li onClick={() => navigate('/catalog')}>Book Catalog</li>
              <li onClick={() => navigate('/database')}>Database View</li>
              <li className="active" onClick={() => navigate('/borrowed-students')}>Borrowed Students</li>
            </ul>
          </div>
        </div>

        <div className="content-area">
          <div className="content-header">
            <h2>Borrowed Students</h2>
            <div className="search-box">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Search students or books..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="students-container">
            {/* Mobile Cards View */}
            <div className="mobile-cards">
              {filteredBooks.map(book => (
                <div key={book.id} className="student-card">
                  <div className="student-info">
                    <h3>{book.studentName}</h3>
                    <span className="student-id">{book.studentId}</span>
                  </div>
                  <div className="book-info">
                    <p><strong>Book:</strong> {book.bookTitle}</p>
                    <div className="dates">
                      <span><strong>Borrowed:</strong> {book.borrowDate}</span>
                      <span><strong>Due:</strong> {book.dueDate}</span>
                    </div>
                    <div className={`status ${getStatusClass(book.returnStatus)}`}>
                      {book.returnStatus}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <table className="students-table">
              <thead>
                <tr>
                  <th>Book Title</th>
                  <th>Borrow Date</th>
                  <th>Due Date</th>
                  <th>Return Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.map(book => (
                  <React.Fragment key={book.id}>
                    <tr className="student-row">
                      <td colSpan="4">
                        <strong>{book.studentName}</strong>
                        <span className="student-id">{book.studentId}</span>
                      </td>
                    </tr>
                    <tr className="book-row">
                      <td><strong>{book.bookTitle}</strong></td>
                      <td>{book.borrowDate}</td>
                      <td>{book.dueDate}</td>
                      <td>
                        <span className={`status-badge ${getStatusClass(book.returnStatus)}`}>
                          {book.returnStatus}
                        </span>
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BorrowedStudentsPage;