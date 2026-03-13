import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import FeaturedMenu from '../components/landing/FeaturedMenu'; // NEW IMPORT
import ReviewsSection from '../components/landing/ReviewsSection';
import HoursCard from '../components/landing/HoursCard';
import DeliverySection from '../components/landing/DeliverySection';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Instagram, ChevronLeft, ChevronRight } from 'lucide-react';
import '../styles/LandingPage.css'; 
import { useTenant } from '../context/TenantContext';

const socialVideos = [
    "/videos/victorprous_9-16.mp4",
    "/videos/Pizza_9-16.mp4",
    "/videos/Tenders_9-16.mp4"
];

const socialVideoTitles = [
    "VICTOR PROUS 🏆",
    "PIZZA TIME 🍕",
    "TENDERS CRUNCHY 🍗"
];

const heroMedia = [
    { type: 'video', src: "/hero/Tour_local_3-2.mp4" },
    { type: 'video', src: "/hero/Patatas_Fritas.mp4" },
    { type: 'video', src: "/hero/Tacos_Mixto_3-2.mp4" },
    { type: 'video', src: "/hero/Burger_Cabra.mp4" },
    { type: 'video', src: "/hero/Plato_Kebab_3-2.mp4" },
    { type: 'video', src: "/hero/Patatas_Bravas.mp4" },
    { type: 'video', src: "/hero/Entrantes.mp4" },
    { type: 'video', src: "/hero/Burger_Clasica.mp4" },
    { type: 'video', src: "/hero/Mango_Lassi.mp4" }
];

// Banner logic now uses heroMedia


const LandingPage = () => {
    const { theme } = useTenant();
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [currentBanner, setCurrentBanner] = useState(0);

    // Auto-slide Hero Media Logic (4s interval for images, videos handle their own onEnded)
    React.useEffect(() => {
        const currentItem = heroMedia[currentBanner];
        if (currentItem.type === 'image') {
            const timeout = setTimeout(() => {
                setCurrentBanner((prev) => (prev + 1) % heroMedia.length);
            }, 4000);
            return () => clearTimeout(timeout);
        }
    }, [currentBanner]);

    const handleHeroVideoEnd = () => {
        setCurrentBanner((prev) => (prev + 1) % heroMedia.length);
    };


    const nextSocialVideo = () => {
        setCurrentVideoIndex((prev) => (prev + 1) % socialVideos.length);
    };

    const prevSocialVideo = () => {
        setCurrentVideoIndex((prev) => (prev - 1 + socialVideos.length) % socialVideos.length);
    };


    return (
        <div className="landing-page">
            <Navbar />

            <section id="hero" className="hero-section">
                <div className="hero-bg"></div>

                <div className="hero-content landing-grid">
                    {/* Left: Text & Image Slider - NOW CENTERED ON PC TOO */}
                    <div className="text-center">

                        <h1 className="hero-title">{theme.restaurantName.toUpperCase()}<br /><span>{theme.restaurantSuffix}</span></h1>

                        <div className="hero-slider-container">
                            {heroMedia.map((item, index) => (
                                index === currentBanner && (
                                    item.type === 'image' ? (
                                        <img
                                            key={index}
                                            src={item.src}
                                            alt="Hero Slide"
                                            className="hero-slide active"
                                        />
                                    ) : (
                                        <video
                                            key={index}
                                            src={item.src}
                                            autoPlay
                                            muted
                                            playsInline
                                            onEnded={handleHeroVideoEnd}
                                            className="hero-slide active"
                                            style={{ objectFit: 'cover' }}
                                        />
                                    )
                                )
                            ))}
                        </div>

                        <p className="hero-subtitle">
                            {theme.seo.description}
                        </p>

                        <div className="hero-buttons">
                            <Link to="/menu" className="hero-link-wrapper">
                                {/* NEW BUTTON STYLE: Hero Badge Style (Outline Gold + Glass) */}
                                <button className="hero-main-btn">
                                    VER CARTA
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* Right: Video Player Slide */}
                    <div className="video-card-container">
                        <div className="video-card">
                            <div className="video-frame-overlay"></div>

                            {/* Video Container */}
                            <div className="video-inner-container">
                                <video
                                    key={socialVideos[currentVideoIndex]}
                                    src={socialVideos[currentVideoIndex]}
                                    autoPlay
                                    muted
                                    playsInline
                                    onEnded={nextSocialVideo}
                                />
                            </div>

                            {/* Gradient Overlay */}
                            <div className="video-gradient-overlay"></div>

                            {/* CONTROLS LAYER */}
                            <div className="video-controls-layer">

                                {/* Left Arrow */}
                                <button onClick={(e) => { e.stopPropagation(); prevSocialVideo(); }} className="arrow-btn arrow-prev">
                                    <ChevronLeft size={24} />
                                </button>

                                {/* Right Arrow */}
                                <button onClick={(e) => { e.stopPropagation(); nextSocialVideo(); }} className="arrow-btn arrow-next">
                                    <ChevronRight size={24} />
                                </button>

                                {/* Title & Dots */}
                                <div className="video-info-overlay">
                                    <p className="video-title">
                                        {socialVideoTitles[currentVideoIndex]}
                                    </p>

                                    {/* Dots Indicator */}
                                    <div className="dots-container">
                                        {socialVideos.map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setCurrentVideoIndex(idx)}
                                                className={`dot ${idx === currentVideoIndex ? 'active' : ''}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURED MENU SECTION (New) */}
            <FeaturedMenu />

            {/* REVIEWS */}
            <ReviewsSection />

            {/* LOCATION & MAP */}
            <section id="location" className="location-section">
                <div className="max-w-[1200px] mx-auto">
                    <div className="section-head mb-12">
                        <h2>UBICACIÓN</h2>
                    </div>

                    <div className="location-stack-container">
                        <div className="map-frame">
                            <iframe
                                title="Mapa" width="100%" height="100%" frameBorder="0"
                                className="map-iframe"
                                src={theme.contact.mapsIframe}
                                allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>

                            <div className="map-overlay">
                                <div className="map-pin-icon">
                                    <MapPin size={16} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-600 m-0">{theme.contact.address}</p>
                                </div>
                                <a href={theme.contact.mapsIframe} target="_blank" rel="noreferrer"
                                    className="map-view-btn">
                                    VER MAPA ➔
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* HOURS SECTION */}
            <section id="hours" className="location-section">
                <div className="max-w-[1200px] mx-auto">
                    <div className="section-head mb-12">
                        <h2>HORARIOS</h2>
                    </div>
                    <div className="location-stack-container">
                        <HoursCard />
                    </div>
                </div>
            </section>

            {/* DELIVERY SECTION */}
            <DeliverySection />

            {/* FOOTER */}
            <footer id="contact" className="landing-footer">
                <div className="max-w-[1200px] mx-auto flex flex-col items-center">

                    <div className="social-links">
                        {theme.socials.instagram && <a href={theme.socials.instagram} target="_blank" rel="noreferrer" className="social-btn"><Instagram size={22} /></a>}
                        {theme.socials.tiktok && (
                            <a href={theme.socials.tiktok} target="_blank" rel="noreferrer" className="social-btn">
                                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                                </svg>
                            </a>
                        )}
                        {theme.contact.phone && (
                            <a href={`https://wa.me/${theme.contact.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="social-btn">
                                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                </svg>
                            </a>
                        )}
                        {theme.contact.phone && <a href={`tel:${theme.contact.phone.replace(/\s+/g, '')}`} className="social-btn"><Phone size={22} /></a>}
                    </div>

                    <div className="text-center">

                        <p className="m-0">{theme.brand.footerText}</p>
                        <p className="footer-dev-text">
                            <a href="https://ayoubjerari.com" target="_blank" rel="noreferrer" className="dev-link">
                                DESIGNED & DEVELOPED BY <span className="dev-name">AYOUBDEV</span>
                            </a>
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
