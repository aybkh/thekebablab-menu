import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
    return (
        <div className="notfound-container">
            <div className="notfound-glow"></div>
            
            <div className="notfound-content">
                <h1 className="notfound-title">404</h1>
                <h2 className="notfound-subtitle">¡Ups! Esta receta no existe</h2>
                <p className="notfound-text">
                    La página que buscas ha sido devorada o está en fase de preparación en cocina. 👨‍🍳
                </p>
                <Link to="/" className="notfound-button">
                    Volver al Inicio
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
