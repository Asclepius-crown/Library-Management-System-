import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider.jsx";
import { useAuth } from "./hooks/useAuth";
import LandingPage from "./pages/LandingPage/landing.jsx";
import CatalogPage from "./pages/Catalog/CatalogPage.jsx";
import DatabasePage from "./pages/DatabasePage/DatabasePage.jsx";
import BorrowedStudentsPage from "./pages/Borrowedstudent/BorrowedStudentsPage.jsx";
import DigitalLibraryPage from "./pages/DigitalLibrary/DigitalLibraryPage.jsx";
import React from "react";
// import NotFoundPage from './pages/NotFoundPage/NotFoundPage.jsx';

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  const ProtectedRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LandingPage showLogin={true} />} />
      <Route path="/register" element={<LandingPage showRegister={true} />} />

      <Route
        path="/catalog"
        element={
          <ProtectedRoute>
            <CatalogPage />
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
            <BorrowedStudentsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/digital-library"
        element={
          <ProtectedRoute>
            <DigitalLibraryPage />
          </ProtectedRoute>
        }
      />

      {/* <Route path="*" element={<NotFoundPage />} /> */}
    </Routes>
  );
}

export default App;
