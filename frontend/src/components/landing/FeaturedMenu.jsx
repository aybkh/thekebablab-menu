import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const featuredData = [
    {
        title: "TACOS FRANCESES",
        subtitle: "Salsas de caseras",
        images: [
            { src: "/products/taco-s.webp", label: "Tamaño S" },
            { src: "/products/taco-m.webp", label: "Tamaño M" },
            { src: "/products/taco-l.webp", label: "Tamaño L" },
            { src: "/products/taco-xl.webp", label: "Tamaño XL" }
        ]
    },
    {
        title: "PIZZAS ARTESANAS",
        subtitle: "Masa fresca hecha al día",
        images: [
            { src: "/products/margarita.webp", label: "Margarita" },
            { src: "/products/tanger-303-pizza.webp", label: "Tanger 303 Esp." },
            { src: "/products/atun.webp", label: "Atún" },
            { src: "/products/marisco-pizza.webp", label: "Marisco" }
        ]
    },
    {
        title: "PLATOS COMBINADOS",
        subtitle: "Generosos y auténticos",
        images: [
            { src: "/products/pollo-plato.webp", label: "Plato de Pollo" },
            { src: "/products/maxi-tenders-plato.webp", label: "Maxi Tenders" },
            { src: "/products/emince-de-pollo-plato.webp", label: "Emincé Pollo" },
            { src: "/products/plato-de-marisco.webp", label: "Plato Marisco" }
        ]
    },
    {
        title: "BATIDOS NATURALES",
        subtitle: "Fruta 100% Fresca",
        images: [
            { src: "/products/aguacate-batido.webp", label: "Aguacate" },
            { src: "/products/fresa-batido.webp", label: "Fresa" },
            { src: "/products/platano-batido.webp", label: "Plátano" },
            { src: "/products/tropical.webp", label: "Tropical" }
        ]
    }
];

const FeaturedCard = ({ item }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

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
        <div className="featured-card">
            {/* Image Slider Container */}
            <div className="card-image-container">
                {item.images.map((img, idx) => (
                    <div key={idx} style={{
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                        opacity: idx === currentIndex ? 1 : 0, transition: 'opacity 0.8s ease-in-out'
                    }}>
                        <img
                            src={img.src}
                            alt={img.label}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
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
    return (
        <section style={{
            padding: '40px 10px',
            position: 'relative',
            zIndex: 10
        }}>
            <style>{`
                .featured-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr); /* Mobile: 2 Columns */
                    gap: 15px;
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 10px;
                }
                
                /* PC Styles */
                @media (min-width: 768px) {
                    .featured-grid {
                        display: flex; /* PC: Flex row */
                        flex-wrap: wrap;
                        justify-content: center;
                        gap: 30px;
                    }
                }

                .featured-card {
                    position: relative;
                    width: 100%; /* Fill Grid Cell */
                    background: #1a1a1a;
                    border-radius: 16px;
                    border: 3px solid #000;
                    box-shadow: 10px 10px 0px rgba(0,0,0,1);
                    overflow: hidden;
                    transition: all 0.3s ease;
                    cursor: pointer;
                    /* MOBILE TILT */
                    transform: rotate(-3deg);
                }
                .featured-card:nth-child(even) {
                    transform: rotate(-3deg);
                }

                @media (min-width: 768px) {
                    .featured-card {
                        width: 280px; /* Fixed width on PC */
                        transform: rotate(-2deg);
                        margin: 10px;
                    }
                    .featured-card:hover {
                        transform: rotate(0deg) scale(1.05);
                        z-index: 10;
                    }
                }

                .card-image-container {
                    position: relative;
                    width: '100%';
                    height: 150px; /* Smaller height on mobile */
                    overflow: hidden;
                    border-bottom: 3px solid #000;
                }

                @media (min-width: 768px) {
                    .card-image-container {
                        height: 220px; /* Larger on PC */
                    }
                }

                .card-badge {
                    position: absolute; bottom: 5px; right: 5px;
                    background: var(--primary); color: white;
                    padding: 2px 8px; borderRadius: 8px;
                    font-size: 0.7rem; font-weight: bold; text-transform: uppercase;
                }

                .card-arrow {
                    position: absolute; top: 50%; transform: translateY(-50%);
                    background: rgba(0,0,0,0.5); color: white; border: none; borderRadius: 50%;
                    padding: 4px; cursor: pointer; display: flex;
                }
                .card-arrow.prev { left: 5px; }
                .card-arrow.next { right: 5px; }

                .card-content {
                    padding: 10px;
                    text-align: center;
                }

                .card-content h3 {
                    font-family: 'Black Ops One', cursive;
                    color: var(--primary);
                    font-size: 0.9rem; /* Smaller font on mobile */
                    margin: 0 0 4px 0;
                    text-transform: uppercase;
                    line-height: 1.1;
                }

                .card-content p {
                    color: #ccc;
                    font-size: 0.75rem; /* Smaller subtitle on mobile */
                    margin: 0;
                    font-family: 'Montserrat', sans-serif;
                    display: none; /* Hide subtitle on very small screens if needed, but let's keep it for now */
                }

                @media (min-width: 768px) {
                    .card-content { padding: 20px; }
                    .card-content h3 { font-size: 1.4rem; margin-bottom: 5px; }
                    .card-content p { font-size: 0.9rem; display: block; }
                    .card-badge { bottom: 10px; right: 10px; padding: 4px 10px; font-size: 0.8rem; }
                }
            `}</style>

            <div className="section-head" style={{ marginBottom: '30px' }}>
                <h2>NUESTROS FAVORITOS</h2>
                <h3 style={{ display: 'block', fontSize: '0.9rem', color: 'var(--primary)', marginTop: '5px', fontFamily: "'Montserrat', sans-serif" }}>
                    DESCUBRE LO MEJOR
                </h3>
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
