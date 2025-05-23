import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CatalogPage.css';
import logo from './logo.jpg';
import { Pencil } from 'lucide-react';
import { ListCollapse } from 'lucide-react';
import { Trash2 } from 'lucide-react';
import { PencilRuler } from 'lucide-react';
import Squares from './Squares/Squares.jsx';

const CatalogPage = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const [books, setBooks] = useState(() => {
    const savedBooks = localStorage.getItem('libraryBooks');
    return savedBooks ? JSON.parse(savedBooks) : [
      { id: 1, title: 'Let Us C++', author: 'Yashavant Kanetkar', isbn: '978-8183331630', location: 'Shelf A1', status: 'Available', publishedCount: 12, borrower: '', dueDate: '', category: 'Computer Science' },
      { id: 2, title: 'BlockChain Quick Reference', author: 'Brenn Hill, Samanyu Chopra, Paul Valencourt', isbn: '978-1788995788', location: 'Shelf B2', status: 'Borrowed', publishedCount: 8, borrower: 'John Doe', dueDate: '2023-12-15', category: 'Computer Science' },
      { id: 3, title: 'Game Programming Pattern', author: 'Robert Nystrom', isbn: '978-0990582908', location: 'Shelf C3', status: 'Borrowed', publishedCount: 15, borrower: '', dueDate: '', category: 'Computer Science' },
      { id: 4, title: 'Building Android Project with Kotlin', author: 'Pankaj Kumar', isbn: '978-1484268145', location: 'Shelf D4', status: 'Available', publishedCount: 5, borrower: '', dueDate: '', category: 'Computer Science' },
    ];
  });

  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    publishedCount: 0,
    isbn: '',
    location: '',
    borrower: '',
    dueDate: '',
    category: ''
  });

  const [editingBook, setEditingBook] = useState(null);
  const [selectedAvailability, setSelectedAvailability] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [errors, setErrors] = useState({});
  const [manualUpdateMode, setManualUpdateMode] = useState(false);
  const [currentlyEditingId, setCurrentlyEditingId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    localStorage.setItem('libraryBooks', JSON.stringify(books));
  }, [books]);

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAvailability = selectedAvailability === 'All' || book.status === selectedAvailability;
    const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
    return matchesSearch && matchesAvailability && matchesCategory;
  });

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate('/');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBook(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateBook = () => {
    const newErrors = {};
    if (!newBook.title) newErrors.title = 'Title is required';
    if (!newBook.author) newErrors.author = 'Author is required';
    if (!newBook.isbn) newErrors.isbn = 'ISBN is required';
    if (newBook.publishedCount < 0) newErrors.publishedCount = 'Publication count must be 0 or more';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddBook = () => {
    if (!validateBook()) return;

    const newEntry = {
      ...newBook,
      id: Date.now(),
      status: 'Available',
      borrower: '',
      dueDate: ''
    };

    setBooks(prev => [...prev, newEntry]);
    resetForm();
  };

  const handleUpdateBook = () => {
    if (!validateBook()) return;

    setBooks(prev =>
      prev.map(book =>
        book.id === currentlyEditingId ? { ...book, ...newBook } : book
      )
    );

    resetForm();
  };

  const handleSaveManualUpdate = () => {
    if (!validateBook()) return;

    setBooks(prev =>
      prev.map(book =>
        book.id === currentlyEditingId
          ? { ...book, ...newBook }
          : book
      )
    );

    resetForm();
    setManualUpdateMode(false);
  };

  const handleStatusChange = (id) => {
    setBooks(prev =>
      prev.map(book =>
        book.id === id
          ? {
              ...book,
              status: book.status === 'Available' ? 'Borrowed' : 'Available',
              borrower: book.status === 'Available' ? 'John Doe' : '',
              dueDate: book.status === 'Available' ? new Date().toISOString().slice(0, 10) : ''
            }
          : book
      )
    );
  };

  const handleDeleteBook = (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      setBooks(prev => prev.filter(book => book.id !== id));
    }
  };

  const handleManualUpdate = (id) => {
    const book = books.find(book => book.id === id);
    setNewBook(book);
    setCurrentlyEditingId(id);
    setManualUpdateMode(true);
  };

  const filterByCategory = (category) => {
    setSelectedCategory(category);
  };

  const resetForm = () => {
    setEditingBook(null);
    setNewBook({
      title: '',
      author: '',
      publishedCount: 0,
      isbn: '',
      location: '',
      borrower: '',
      dueDate: '',
      category: ''
    });
    setErrors({});
    setCurrentlyEditingId(null);
    setManualUpdateMode(false);
    setShowMobileSearch(false);
  };

  return (
    <div className="catalog-page">
      <div className="header-section">
        <div className="header-left">
          <img src={logo} alt="Athenaeum Logo" className="logo" />
          <h1 className="app-title">Athenaeum</h1>
        </div>
        <button className="logout-button" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i> {!isMobile && 'Logout'}
        </button>
      </div>

      <div className="main-content">
        <div className="sidebar">
          <div className="sidebar-section">
            <h3>Projects</h3>
            <ul>
              <li className="active">Book Catalog</li>
              <li onClick={() => navigate('/database')}>Database View</li>
              <li onClick={() => navigate('/borrowed-students')}>Borrowed Students</li>
            </ul>
          </div>

          <div className="sidebar-section">
            <h3>Engineering Categories</h3>
            <ul>
              <li className={selectedCategory === 'All' ? 'active' : ''} onClick={() => filterByCategory('All')}>All Categories</li>
              <li className={selectedCategory === 'Computer Science' ? 'active' : ''} onClick={() => filterByCategory('Computer Science')}>Computer Science</li>
              <li className={selectedCategory === 'Electrical Engineering' ? 'active' : ''} onClick={() => filterByCategory('Electrical Engineering')}>Electrical Engineering</li>
              <li className={selectedCategory === 'Mechanical Engineering' ? 'active' : ''} onClick={() => filterByCategory('Mechanical Engineering')}>Mechanical Engineering</li>
              <li className={selectedCategory === 'Civil Engineering' ? 'active' : ''} onClick={() => filterByCategory('Civil Engineering')}>Civil Engineering</li>
              <li className={selectedCategory === 'Chemical Engineering' ? 'active' : ''} onClick={() => filterByCategory('Chemical Engineering')}>Chemical Engineering</li>
              <li className={selectedCategory === 'Aerospace Engineering' ? 'active' : ''} onClick={() => filterByCategory('Aerospace Engineering')}>Aerospace Engineering</li>
              <li className={selectedCategory === 'Biomedical Engineering' ? 'active' : ''} onClick={() => filterByCategory('Biomedical Engineering')}>Biomedical Engineering</li>
              <li className={selectedCategory === 'Environmental Engineering' ? 'active' : ''} onClick={() => filterByCategory('Environmental Engineering')}>Environmental Engineering</li>
              <li className={selectedCategory === 'Humanity' ? 'active' : ''} onClick={() => filterByCategory('Humanity')}>Humanity</li>
            </ul>
          </div>
        </div>

        <div className="content-area">
          <Squares 
            className="Squares"
            speed={0.5} 
            squareSize={40}
            direction='diagonal'
            borderColor='#fff'
            hoverFillColor='#222'
          />
          
          <div className="content-header">
            <h2>Book Catalog</h2>
            <div className="header-actions">
              <div className={`search-box ${showMobileSearch ? 'mobile-search-visible' : ''}`}>
                {isMobile ? (
                  <>
                    <i 
                      className="fas fa-search" 
                      onClick={() => setShowMobileSearch(!showMobileSearch)}
                    ></i>
                    {showMobileSearch && (
                      <input
                        type="text"
                        placeholder="Search books..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        autoFocus
                      />
                    )}
                  </>
                ) : (
                  <>
                    <i className="fas fa-search"></i>
                    <input
                      type="text"
                      placeholder="Search books..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </>
                )}
              </div>
              <button 
                className="primary-button" 
                onClick={() => setEditingBook({})}
                title={isMobile ? 'Add Book' : ''}
              >
                <i className="fas fa-plus-circle"></i> {!isMobile && 'Add Book'}
              </button>
            </div>
          </div>

          <div className="card-container">
            <div className="filters-card">
              <h3>Filters</h3>
              <div className="filter-group">
                <label>Availability</label>
                <select
                  value={selectedAvailability}
                  onChange={(e) => setSelectedAvailability(e.target.value)}
                >
                  <option value="All">All</option>
                  <option value="Available">Available</option>
                  <option value="Borrowed">Borrowed</option>
                </select>
              </div>
              <div className="filter-group">
                <label>Sort By</label>
                <select>
                  <option>Title (A-Z)</option>
                  <option>Title (Z-A)</option>
                  <option>Most Published</option>
                </select>
              </div>
            </div>

            <div className="books-grid">
              {filteredBooks.map(book => (
                <div className="book-card" key={book.id}>
                  <div className="card-header">
                    <h3>{book.title}</h3>
                    <span className={`status-badge ${book.status.toLowerCase()}`}>
                      {isMobile ? book.status.charAt(0) : book.status}
                    </span>
                  </div>
                  <div className="card-body">
                    <p><strong>Author:</strong> {book.author}</p>
                    <p><strong>ISBN:</strong> {book.isbn}</p>
                    <p><strong>Location:</strong> {book.location}</p>
                    <p><strong>Category:</strong> {book.category || 'Not specified'}</p>
                    {book.status === 'Borrowed' && (
                      <>
                        <p><strong>Borrower:</strong> {book.borrower}</p>
                        <p><strong>Due:</strong> {book.dueDate ? new Date(book.dueDate).toLocaleDateString() : 'Not specified'}</p>
                      </>
                    )}
                  </div>
                  <div className="card-actions">
                    <button 
                      className="icon-button" 
                      title="Edit"
                      onClick={() => {
                        setEditingBook(book);
                        setNewBook(book);
                        setCurrentlyEditingId(book.id);
                      }}
                    >
                      {isMobile ? <i className="fas fa-pen"></i> : <Pencil size={16} color="black" />}
                    </button>
                    <button 
                      className="icon-button" 
                      title="Toggle Status"
                      onClick={() => handleStatusChange(book.id)}
                    >
                      {isMobile ? <i className="fas fa-pen"></i> : <ListCollapse size={16} color="black" />}
                    </button>
                    <button 
                      className="icon-button danger" 
                      title="Delete"
                      onClick={() => handleDeleteBook(book.id)}
                    >
                      {isMobile ? <i className="fas fa-pen"></i> : <Trash2 size={16} color="black" />}
                    </button>
                    {!isMobile && (
                      <button 
                        className="icon-button" 
                        title="Advanced Edit"
                        onClick={() => handleManualUpdate(book.id)}
                      >
                        {isMobile ? <i className="fas fa-pen"></i> : <PencilRuler  size={16} color="black" />}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {(editingBook || manualUpdateMode) && (
            <div className="modal-overlay">
              <div className="modal-card">
                <div className="modal-header">
                  <h3>{manualUpdateMode ? 'Advanced Edit' : editingBook ? 'Edit Book' : 'Add Book'}</h3>
                  <button className="close-button" onClick={resetForm}>
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Title</label>
                    <input type="text" name="title" value={newBook.title} onChange={handleInputChange} className={errors.title ? 'error' : ''} />
                    {errors.title && <span className="error-message">{errors.title}</span>}
                  </div>
                  <div className="form-group">
                    <label>Author</label>
                    <input type="text" name="author" value={newBook.author} onChange={handleInputChange} className={errors.author ? 'error' : ''} />
                    {errors.author && <span className="error-message">{errors.author}</span>}
                  </div>
                  <div className={isMobile ? "" : "form-row"}>
                    <div className="form-group">
                      <label>ISBN</label>
                      <input type="text" name="isbn" value={newBook.isbn} onChange={handleInputChange} className={errors.isbn ? 'error' : ''} />
                      {errors.isbn && <span className="error-message">{errors.isbn}</span>}
                    </div>
                    <div className="form-group">
                      <label>Publication Count</label>
                      <input type="number" name="publishedCount" value={newBook.publishedCount} onChange={handleInputChange} className={errors.publishedCount ? 'error' : ''} />
                      {errors.publishedCount && <span className="error-message">{errors.publishedCount}</span>}
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Location</label>
                    <input type="text" name="location" value={newBook.location} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <select name="category" value={newBook.category || ''} onChange={handleInputChange}>
                      <option value="">Select a category</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Electrical Engineering">Electrical Engineering</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                      <option value="Civil Engineering">Civil Engineering</option>
                      <option value="Chemical Engineering">Chemical Engineering</option>
                      <option value="Aerospace Engineering">Aerospace Engineering</option>
                      <option value="Biomedical Engineering">Biomedical Engineering</option>
                      <option value="Environmental Engineering">Environmental Engineering</option>
                      <option value="Humanity">Humanity</option>
                    </select>
                  </div>
                  {manualUpdateMode && (
                    <>
                      <div className="form-group">
                        <label>Status</label>
                        <select name="status" value={newBook.status} onChange={handleInputChange}>
                          <option value="Available">Available</option>
                          <option value="Borrowed">Borrowed</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Borrower</label>
                        <input type="text" name="borrower" value={newBook.borrower} onChange={handleInputChange} />
                      </div>
                      <div className="form-group">
                        <label>Due Date</label>
                        <input type="date" name="dueDate" value={newBook.dueDate} onChange={handleInputChange} />
                      </div>
                    </>
                  )}
                </div>
                <div className="modal-footer">
                  <button className="secondary-button" onClick={resetForm}>
                    Cancel
                  </button>
                  <button className="primary-button" onClick={manualUpdateMode ? handleSaveManualUpdate : editingBook ? handleUpdateBook : handleAddBook}>
                    {manualUpdateMode ? 'Save Changes' : editingBook ? 'Update Book' : 'Add Book'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CatalogPage;