import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const featuredData = [
    {
        title: "ENTRANTES Y TAPAS",
        subtitle: "Para abrir el apetito",
        images: [
            { src: "/products/nuestras-patatas-fritas.webp", label: "Patatas Fritas" },
            { src: "/products/nuestras-patatas-bravas.webp", label: "Patatas Bravas" },
            { src: "/products/nugguets-de-pollo.webp", label: "Nuggets" },
            { src: "/products/tenders-de-pollo.webp", label: "Tenders" }
        ]
    },
    {
        title: "DÜRÜM",
        subtitle: "Enrollados deliciosos",
        images: [
            { src: "/products/durum-de-pollo.webp", label: "Dürüm Pollo" },
            { src: "/products/durum-de-ternera.webp", label: "Dürüm Ternera" },
            { src: "/products/durum-de-falafel.webp", label: "Dürüm Falafel" },
            { src: "/products/durum-mix.webp", label: "Dürüm Mixto" }
        ]
    },
    {
        title: "PITA",
        subtitle: "El clásico irresistible",
        images: [
            { src: "/products/pita-de-pollo.webp", label: "Pita Pollo" },
            { src: "/products/pita-de-ternera.webp", label: "Pita Ternera" },
            { src: "/products/pita-falafel.webp", label: "Pita Falafel" },
            { src: "/products/pita-mix.webp", label: "Pita Mixto" }
        ]
    },
    {
        title: "PIZZAS ARTESANAS",
        subtitle: "Masa fresca del día",
        images: [
            { src: "/products/pizza-margarita.webp", label: "Margarita" },
            { src: "/products/pizza-kebab.webp", label: "Pizza Kebab" },
            { src: "/products/pizza-tonno.webp", label: "Atún" },
            { src: "/products/pizza-barbacoa.webp", label: "Barbacoa" }
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
                    background: #ffffff; /* Solid White */
                    border-radius: 12px;
                    border: 4px solid #000; /* Thick Black Border */
                    box-shadow: 6px 6px 0px 0px rgba(0,0,0,1); /* Hard Shadow */
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
                        transform: translate(-3px, -3px) rotate(-2deg);
                        box-shadow: 8px 8px 0px 0px rgba(0,0,0,1);
                        z-index: 10;
                    }
                }

                .card-image-container {
                    position: relative;
                    width: 100%;
                    height: 150px; /* Smaller height on mobile */
                    overflow: hidden;
                    border-bottom: 4px solid #000;
                }

                @media (min-width: 768px) {
                    .card-image-container {
                        height: 220px; /* Larger on PC */
                    }
                }

                .card-badge {
                    position: absolute; bottom: 5px; right: 5px;
                    background: var(--primary); color: #000; border: 2px solid #000;
                    padding: 2px 8px; borderRadius: 0;
                    font-size: 0.8rem; font-weight: bold; text-transform: uppercase;
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
                    font-family: 'Bebas Neue', sans-serif;
                    color: #000;
                    font-size: 1.2rem; /* Mobile font */
                    margin: 0 0 4px 0;
                    text-transform: uppercase;
                    line-height: 1.1;
                    letter-spacing: 1px;
                }

                .card-content p {
                    color: #444;
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

            <div className="section-head" style={{ marginBottom: '30px', textAlign: 'center' }}>
                <h2 style={{ fontSize: '3rem', margin: 0 }}>NUESTROS FAVORITOS</h2>
                <h3 style={{ display: 'block', fontSize: '1.2rem', color: 'var(--primary)', marginTop: '5px', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '2px' }}>
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
