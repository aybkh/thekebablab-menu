import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSiteConfig } from '../../context/SiteConfigContext';
import { useLanguage } from '../../context/LanguageContext';

const FeaturedCard = ({ item }) => {
    const { t } = useLanguage();
    const [currentIndex, setCurrentIndex] = useState(0);
    
    // Check if this card is the Combo Box one to apply special styling
    const isCombo = item.title === "Combo Box" || item.title === "MENÚS Y COMBOS" || item.title === "MENUS Y COMBOS";

    const nextSlide = (e) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % item.images.length);
    };

    const prevSlide = (e) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + item.images.length) % item.images.length);
    };

    // Auto-slide effect
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % item.images.length);
        }, 4000 + Math.random() * 1000);
        return () => clearInterval(interval);
    }, [item.images.length]);

    return (
        <div className={`featured-card ${isCombo ? 'is-combo' : ''}`}>
            {isCombo && (
                <div className="new-tag-badge">
                    {t('new')}
                </div>
            )}
            {/* Image Slider Container */}
            <div className="card-image-container">
                {item.images.map((img, idx) => (
                    <div key={idx} className={`featured-slide ${idx === currentIndex ? 'active' : ''}`}>
                        <img
                            src={img.src}
                            alt={img.label}
                        />
                        {/* Label Badge */}
                        <div className="card-badge">
                            {img.label}
                        </div>
                    </div>
                ))}

                {/* Arrows (Hidden on very small screens if needed, but useful) */}
                <button onClick={prevSlide} className="card-arrow prev"><ChevronLeft size={16} /></button>
                <button onClick={nextSlide} className="card-arrow next"><ChevronRight size={16} /></button>
            </div>

            {/* Content */}
            <div className="card-content">
                <h3>{item.title}</h3>
                <p>{item.subtitle}</p>
            </div>
        </div>
    );
};

const FeaturedMenu = () => {
    const { siteConfig } = useSiteConfig();
    const featuredData = siteConfig?.featuredMenu || [];

    return (
        <section className="featured-section">
            <div className="section-head">
                <h2>NUESTROS FAVORITOS</h2>
                <span className="featured-subtitle-head">
                    DESCUBRE LO MEJOR
                </span>
            </div>

            <div className="featured-grid">
                {featuredData.map((item, idx) => (
                    <FeaturedCard key={idx} item={item} />
                ))}
            </div>
        </section>
    );
};

export default FeaturedMenu;
