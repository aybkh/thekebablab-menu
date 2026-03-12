import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const featuredData = [
    {
        title: "ENTRANTES",
        images: [
            { src: "/products/nuestras-patatas-fritas.webp", label: "Patatas Fritas" },
            { src: "/products/nuestras-patatas-bravas.webp", label: "Patatas Bravas" },
            { src: "/products/nugguets-de-pollo.webp", label: "Nuggets" },
            { src: "/products/tenders-de-pollo.webp", label: "Tenders" }
        ]
    },
    {
        title: "DÜRÜM",
        images: [
            { src: "/products/durum-de-pollo.webp", label: "Dürüm Pollo" },
            { src: "/products/durum-de-ternera.webp", label: "Dürüm Ternera" },
            { src: "/products/durum-de-falafel.webp", label: "Dürüm Falafel" },
            { src: "/products/durum-mix.webp", label: "Dürüm Mixto" }
        ]
    },
    {
        title: "PITA",
        images: [
            { src: "/products/pita-de-pollo.webp", label: "Pita Pollo" },
            { src: "/products/pita-de-ternera.webp", label: "Pita Ternera" },
            { src: "/products/pita-falafel.webp", label: "Pita Falafel" },
            { src: "/products/pita-mix.webp", label: "Pita Mixto" }
        ]
    },
    {
        title: "PIZZAS",
        images: [
            { src: "/products/pizza-margarita.webp", label: "Pizza Margarita" },
            { src: "/products/pizza-kebab.webp", label: "Pizza Kebab" },
            { src: "/products/pizza-tonno.webp", label: "Pizza Atún" },
            { src: "/products/pizza-barbacoa.webp", label: "Pizza Barbacoa" },
        ]
    },
    {
        title: "TACOS",
        images: [
            { src: "/products/taco-de-pollo.webp", label: "Taco de Pollo" },
            { src: "/products/taco-de-ternera.webp", label: "Taco de Ternera" },
            { src: "/products/taco-de-nugguets.webp", label: "Taco de Nuggets" },
            { src: "/products/taco-mix.webp", label: "Taco Mixto" }
        ]
    },
    {
        title: "Batidos y postres",
        images: [
            { src: "/products/batido-de-aguacate.webp", label: "Batido de Aguacate" },
            { src: "/products/mango-lassi.webp", label: "Mango Lassi" },
            { src: "/products/tarta-de-queso.webp", label: "Tarta de Queso" },
            { src: "/products/cortado.webp", label: "Cortado" }
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
