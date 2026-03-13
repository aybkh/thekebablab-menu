import React from 'react';
import './PriceDisplay.css';

const PriceDisplay = ({ price, className = "" }) => {
    if (price === undefined || price === null) return null;

    const formattedPrice = Number(price).toFixed(2);
    const [integerPart, decimalPart] = formattedPrice.split('.');

    return (
        <span className={`price-display ${className}`}>
            <span className="price-integer">{integerPart}</span>
            <span className="price-decimal">,{decimalPart}</span>
            <span className="price-currency">€</span>
        </span>
    );
};

export default PriceDisplay;
