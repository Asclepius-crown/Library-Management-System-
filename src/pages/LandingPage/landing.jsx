import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import logo from './logo.jpg';

const LandingPage = ({ showLogin = false, showRegister = false, setIsAuthenticated }) => {
    const navigate = useNavigate();
    const [activeForm, setActiveForm] = useState(
        showLogin ? 'login' : showRegister ? 'register' : null
    );
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        
        if (activeForm === 'register') {
            if (!formData.name) {
                newErrors.name = 'Name is required';
            }
            if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Passwords must match';
            }
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        setIsLoading(true);
        
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setIsAuthenticated(true);
            navigate('/catalog');
        } catch (error) {
            setErrors({ submit: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAuthClick = (type) => {
        setActiveForm(type);
        navigate(`/${type}`);
    };

    return (
        <div className="landing-container">
            <div className="auth-buttons">
                <button 
                    className={`auth-btn login-btn ${activeForm === 'login' ? 'active' : ''}`}
                    onClick={() => handleAuthClick('login')}
                >
                    Login
                </button>
                <button 
                    className={`auth-btn register-btn ${activeForm === 'register' ? 'active' : ''}`}
                    onClick={() => handleAuthClick('register')}
                >
                    Register
                </button>
            </div>

            {(activeForm === 'login' || activeForm === 'register') && (
                <div className="auth-modal">
                    <div className="auth-form">
                        <button 
                            className="close-btn"
                            onClick={() => {
                                setActiveForm(null);
                                navigate('/');
                            }}
                            aria-label="Close modal"
                        >
                            ×
                        </button>
                        
                        <h3>{activeForm === 'login' ? 'Login' : 'Register'}</h3>
                        
                        <form onSubmit={handleSubmit}>
                            {activeForm === 'register' && (
                                <div className="form-group">
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Full Name"
                                        className={errors.name ? 'error' : ''}
                                    />
                                    {errors.name && <span className="error-message">{errors.name}</span>}
                                </div>
                            )}
                            
                            <div className="form-group">
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Email"
                                    className={errors.email ? 'error' : ''}
                                />
                                {errors.email && <span className="error-message">{errors.email}</span>}
                            </div>
                            
                            <div className="form-group">
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Password"
                                    className={errors.password ? 'error' : ''}
                                />
                                {errors.password && <span className="error-message">{errors.password}</span>}
                            </div>
                            
                            {activeForm === 'register' && (
                                <div className="form-group">
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        placeholder="Confirm Password"
                                        className={errors.confirmPassword ? 'error' : ''}
                                    />
                                    {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                                </div>
                            )}
                            
                            {errors.submit && <div className="submit-error">{errors.submit}</div>}
                            
                            <button type="submit" className="submit-btn" disabled={isLoading}>
                                {isLoading ? 'Processing...' : activeForm === 'login' ? 'Login' : 'Register'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
            
            <div className="content-section">
                <header className="landing-header">
                    <img src={logo} alt="Athenaeum Logo" className="logo" />
                    <h1>Welcome to the Athenaeum</h1>
                    <p className="tagline">Your gateway to knowledge and resources</p>
                </header>
                
                <div className="divider"></div>
                
                <nav className="landing-nav">
                    <button 
                        className="nav-button"
                        onClick={() => navigate('/catalog')}
                    >
                        <span className="button-icon">📚</span>
                        <span className="button-text">Catalog</span>
                        <p className="button-description">Browse our collection of books</p>
                    </button>
                    
                    <button 
                        className="nav-button"
                        onClick={() => navigate('/digital-library')}
                    >
                        <span className="button-icon">💻</span>
                        <span className="button-text">Digital Library</span>
                        <p className="button-description">Access our digital resources</p>
                    </button>
                    
                    <button 
                        className="nav-button"
                        onClick={() => navigate('/database')}
                    >
                        <span className="button-icon">📊</span>
                        <span className="button-text">Database</span>
                        <p className="button-description">View library statistics</p>
                    </button>
                    
                    <button 
                        className="nav-button"
                        onClick={() => navigate('/borrowed-students')}
                    >
                        <span className="button-icon">👥</span>
                        <span className="button-text">Borrowed Books</span>
                        <p className="button-description">Track borrowed items</p>
                    </button>
                </nav>
            </div>
            
            
        </div>
    );
};

export default LandingPage;