import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NotFoundPage.css';

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div calssName="not-found-container">
            <h1> 404 - Page Not Found </h1>
            <p>The page you're looking for doesn't exist</p>
            <button onClick={() => navigate('/')} className="home-button">Go To Home</button>
        </div>
    );
};

export default NotFoundPage;