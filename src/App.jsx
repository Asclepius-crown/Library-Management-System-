import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import LandingPage from './pages/LandingPage/landing.jsx';
import CatalogPage from './pages/Catalog/CatalogPage.jsx';
import DatabasePage from './pages/DatabasePage/DatabasePage.jsx';
import BorrowedStudentsPage from './pages/Borrowedstudent/BorrowedStudentsPage.jsx';
import DigitalLibraryPage from './pages/DigitalLibrary/DigitalLibraryPage.jsx';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage.jsx';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const ProtectedRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route 
          path="/login" 
          element={
            <LandingPage 
              showLogin={true} 
              setIsAuthenticated={setIsAuthenticated} 
            />
          } 
        />
        <Route 
          path="/register" 
          element={
            <LandingPage 
              showRegister={true} 
              setIsAuthenticated={setIsAuthenticated} 
            />
          } 
        />
        <Route 
          path="/catalog" 
          element={
            <ProtectedRoute>
              <CatalogPage setIsAuthenticated={setIsAuthenticated} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/database" 
          element={
            <ProtectedRoute>
              <DatabasePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/borrowed-students" 
          element={
            <ProtectedRoute>
              <BorrowedStudentsPage setIsAuthenticated={setIsAuthenticated} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/digital-library" 
          element={
            <ProtectedRoute>
              <DigitalLibraryPage setIsAuthenticated={setIsAuthenticated} />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;