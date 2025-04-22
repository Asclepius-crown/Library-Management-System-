import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DigitalLibraryPage.css';

const DigitalLibraryPage = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Engineering book data
  const books = [
    {
      id: 1,
      title: "Mechanical Engineering Design",
      author: "J.E. Shigley",
      category: "Mechanical Engineering",
      coverImage: "https://m.media-amazon.com/images/I/71QN2X1QNJL._AC_UF1000,1000_QL80_.jpg",
      type: "eBook"
    },
    {
      id: 2,
      title: "Fundamentals of Electric Circuits",
      author: "Charles Alexander",
      category: "Electrical Engineering",
      coverImage: "https://m.media-amazon.com/images/I/71QN2X1QNJL._AC_UF1000,1000_QL80_.jpg",
      type: "eBook"
    },
    {
      id: 3,
      title: "Introduction to Algorithms",
      author: "Thomas H. Cormen",
      category: "Computer Engineering",
      coverImage: "https://m.media-amazon.com/images/I/71QN2X1QNJL._AC_UF1000,1000_QL80_.jpg",
      type: "eBook"
    },
    {
      id: 4,
      title: "Structural Analysis",
      author: "R.C. Hibbeler",
      category: "Civil Engineering",
      coverImage: "https://m.media-amazon.com/images/I/71QN2X1QNJL._AC_UF1000,1000_QL80_.jpg",
      type: "Audiobook"
    },
    {
      id: 5,
      title: "Chemical Process Safety",
      author: "Daniel A. Crowl",
      category: "Chemical Engineering",
      coverImage: "https://m.media-amazon.com/images/I/71QN2X1QNJL._AC_UF1000,1000_QL80_.jpg",
      type: "eBook"
    },
    {
      id: 6,
      title: "Introduction to Flight",
      author: "John D. Anderson",
      category: "Aerospace Engineering",
      coverImage: "https://m.media-amazon.com/images/I/71QN2X1QNJL._AC_UF1000,1000_QL80_.jpg",
      type: "Audiobook"
    },
    {
      id: 7,
      title: "Biomedical Engineering Fundamentals",
      author: "Joseph D. Bronzino",
      category: "Biomedical Engineering",
      coverImage: "https://m.media-amazon.com/images/I/71QN2X1QNJL._AC_UF1000,1000_QL80_.jpg",
      type: "Audiobook"
    },
    {
      id: 8,
      title: "Environmental Engineering Science",
      author: "William W. Nazaroff",
      category: "Environmental Engineering",
      coverImage: "https://m.media-amazon.com/images/I/71QN2X1QNJL._AC_UF1000,1000_QL80_.jpg",
      type: "eBook"
    }
  ];

  const categories = [
    'All',
    'Mechanical Engineering',
    'Electrical Engineering',
    'Computer Engineering',
    'Civil Engineering',
    'Chemical Engineering',
    'Aerospace Engineering',
    'Biomedical Engineering',
    'Environmental Engineering'
  ];

  const fileTypes = ['All', 'eBook', 'Audiobook'];

  const filteredBooks = books.filter(book => {
    const matchesSearch = 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
    const matchesType = selectedType === 'All' || book.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="digital-library-container">
      <header className="library-header">
        <div className="header-left">
          <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
            ☰
          </button>
          <div className="logo-container">
            <h1>Engineering Digital Library</h1>
          </div>
        </div>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search engineering resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <div className="library-content">
        <aside className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
          <div className="sidebar-section">
            <h3>Engineering Disciplines</h3>
            <ul>
              {categories.map((category, index) => (
                <li 
                  key={index} 
                  className={selectedCategory === category ? 'active' : ''}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </li>
              ))}
            </ul>
          </div>

          <div className="sidebar-section">
            <h3>Resource Type</h3>
            <ul>
              {fileTypes.map((type, index) => (
                <li 
                  key={index}
                  className={selectedType === type ? 'active' : ''}
                  onClick={() => setSelectedType(type)}
                >
                  {type}
                </li>
              ))}
            </ul>
          </div>

          <div className="sidebar-section">
            <h3>Engineering Tools</h3>
            <ul>
              <li>CAD Resources</li>
              <li>Simulation Software</li>
              <li>Technical Standards</li>
              <li>Research Papers</li>
            </ul>
          </div>
        </aside>

        <main className="book-grid">
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <div key={book.id} className="book-card">
                <div className="book-cover">
                  <img src={book.coverImage} alt={book.title} />
                  <span className="book-type-badge">{book.type}</span>
                </div>
                <div className="book-info">
                  <h3>{book.title}</h3>
                  <p className="author">{book.author}</p>
                  <p className="category">{book.category}</p>
                  <div className="book-actions">
                    <button className="read-btn">Read Now</button>
                    {book.type === 'eBook' && (
                      <button className="download-btn">Download</button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <p>No engineering resources found matching your criteria.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DigitalLibraryPage;