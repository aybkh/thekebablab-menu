import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import FeaturedMenu from '../components/landing/FeaturedMenu'; // NEW IMPORT
import ReviewsSection from '../components/landing/ReviewsSection';
import HoursCard from '../components/landing/HoursCard';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Instagram, ChevronLeft, ChevronRight } from 'lucide-react';
import './LandingPage.css';
import { useTenant } from '../context/TenantContext';

const videos = [
    "/videos/kebab_tour.mp4",
    "/videos/video_reydelacomida.mp4",
    "/videos/video_plato_calamares_tajin_gambas.mp4"
];

const videoTitles = [
    "TOUR DEL LOCAL 📍",
    "EL REY DE LA COMIDA 👑",
    "PLATOS DELICIOSOS 🍤"
];

// Updated Banner Images with Absolute Paths
const bannerImages = [
    "/hero/banner3.webp",
    "/hero/banner1.webp",
    "/hero/banner4.webp",
    "/hero/banner.webp",
    "/hero/banner2.webp"
];

const LandingPage = () => {
    const { theme } = useTenant();
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [currentBanner, setCurrentBanner] = useState(0);

    // Auto-slide Banner Logic (3s interval)
    React.useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBanner((prev) => (prev + 1) % bannerImages.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const handleVideoEnd = () => {
        nextVideo();
    };

    const nextVideo = () => {
        setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
    };

    const prevVideo = () => {
        setCurrentVideoIndex((prev) => (prev - 1 + videos.length) % videos.length);
    };

    return (
        <div className="landing-page">
            <Navbar />

            <section id="hero" className="hero-section">
                <div className="hero-bg"></div>

                <div className="hero-content landing-grid">
                    {/* Left: Text & Image Slider - NOW CENTERED ON PC TOO */}
                    <div className="text-center">

                        <div className="hero-badge">{theme.brand.heroBadge}</div>

                        <h1 className="hero-title">{theme.restaurantName.toUpperCase()}<br /><span>{theme.restaurantSuffix}</span></h1>

                        {/* HERO IMAGE SLIDER (Class-based Responsive Alignment) */}
                        <div className="hero-slider-container">
                            {bannerImages.map((src, index) => (
                                <img
                                    key={index}
                                    src={src}
                                    alt="Hero Slide"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        opacity: currentBanner === index ? 1 : 0,
                                        transition: 'opacity 1s ease-in-out' // Clean Fade
                                    }}
                                />
                            ))}
                        </div>

                        <p className="hero-subtitle">
                            {theme.seo.description}
                        </p>

                        <div className="hero-buttons" style={{ justifyContent: 'center', marginTop: '20px' }}>
                            <Link to="/menu" style={{ textDecoration: 'none', width: '100%', maxWidth: '350px' }}>
                                {/* NEW BUTTON STYLE: Sticker Style */}
                                <button className="btn-primary" style={{
                                    width: '100%',
                                    padding: '20px 40px',
                                    fontSize: '1.8rem',
                                    borderRadius: '12px',
                                    background: 'var(--primary)',
                                    color: '#000',
                                    border: '4px solid #000', // Solid Black Border
                                    cursor: 'pointer',
                                    fontFamily: "'Bebas Neue', sans-serif",
                                    letterSpacing: '2px',
                                    boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)', // Hard Shadow
                                    transition: 'all 0.2s ease',
                                    fontWeight: 'bold',
                                    textTransform: 'uppercase'
                                }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translate(-2px, -2px)';
                                        e.currentTarget.style.boxShadow = '8px 8px 0px 0px rgba(0,0,0,1)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translate(0px, 0px)';
                                        e.currentTarget.style.boxShadow = '6px 6px 0px 0px rgba(0,0,0,1)';
                                    }}
                                >
                                    VER CARTA
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* Right: Video Player Slide */}
                    <div className="video-card-container">
                        <div className="video-card" style={{ border: 'none', position: 'relative', borderRadius: '30px' }}>

                            {/* FRAME OVERLAY (Reduces bleeding) */}
                            <div style={{
                                position: 'absolute', inset: -2,
                                border: '6px solid #000',
                                borderRadius: '30px',
                                pointerEvents: 'none',
                                zIndex: 60,
                                boxShadow: '8px 8px 0px 0px #000'
                            }}></div>

                            {/* Video Container */}
                            <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, background: '#000', overflow: 'hidden', borderRadius: '26px' }}>
                                <video
                                    key={videos[currentVideoIndex]}
                                    src={videos[currentVideoIndex]}
                                    autoPlay
                                    muted
                                    playsInline
                                    onEnded={handleVideoEnd}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>

                            {/* Gradient Overlay */}
                            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', pointerEvents: 'none', zIndex: 10, borderRadius: '0 0 26px 26px' }}></div>

                            {/* CONTROLS LAYER */}
                            <div style={{ position: 'absolute', inset: 0, zIndex: 70, pointerEvents: 'none' }}>

                                {/* Left Arrow */}
                                <button onClick={(e) => { e.stopPropagation(); prevVideo(); }} className="arrow-btn arrow-prev">
                                    <ChevronLeft size={24} />
                                </button>

                                {/* Right Arrow */}
                                <button onClick={(e) => { e.stopPropagation(); nextVideo(); }} className="arrow-btn arrow-next">
                                    <ChevronRight size={24} />
                                </button>

                                {/* Title & Dots */}
                                <div style={{ position: 'absolute', bottom: '20px', left: 0, right: 0, textAlign: 'center', pointerEvents: 'auto' }}>

                                    {/* Title */}
                                    <p style={{ fontFamily: "'Black Ops One', cursive", fontSize: '1.1rem', color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.8)', marginBottom: '10px' }}>
                                        {videoTitles[currentVideoIndex]}
                                    </p>

                                    {/* Dots Indicator */}
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                                        {videos.map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setCurrentVideoIndex(idx)}
                                                style={{
                                                    width: '8px', height: '8px', borderRadius: '50%', border: 'none', padding: 0,
                                                    background: idx === currentVideoIndex ? '#F1C40F' : 'rgba(255,255,255,0.4)',
                                                    cursor: 'pointer', transition: 'all 0.3s',
                                                    transform: idx === currentVideoIndex ? 'scale(1.2)' : 'scale(1)'
                                                }}
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
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

                    {/* Main Title H2 */}
                    <div className="section-head">
                        <h2>UBICACIÓN</h2>
                    </div>

                    {/* LOCATION CONTAINER (Forces Stack Layout on PC) */}
                    <div className="location-stack-container">
                        {/* MAP (Column 1) */}
                        <div className="map-frame">
                            <iframe
                                title="Mapa" width="100%" height="100%" frameBorder="0"
                                style={{ border: 0 }}
                                src={theme.contact.mapsIframe}
                                allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>

                            <div className="map-overlay">
                                <div style={{ background: '#142818', padding: '10px', borderRadius: '50%', color: 'white', display: 'flex' }}>
                                    <MapPin size={22} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontWeight: 'bold', margin: 0, color: 'black' }}>{theme.restaurantName} {theme.restaurantSuffix}</p>
                                    <p style={{ fontSize: '0.85rem', color: '#555', margin: 0 }}>{theme.contact.address}</p>
                                </div>
                                <a href={theme.contact.mapsIframe} target="_blank" rel="noreferrer"
                                    style={{ background: 'var(--secondary)', color: 'var(--text-main)', padding: '8px 12px', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                                    VER MAPA ➔
                                </a>
                            </div>
                        </div>

                        {/* HOURS & DELIVERY (Column 2 -> Now Stacked) */}
                        <div style={{ width: '100%', padding: '20px 0' }}>

                            <div className="section-head" style={{ marginBottom: '15px' }}>
                                <h2>HORARIOS</h2>
                            </div>

                            <HoursCard />

                            <div id="delivery" className="section-head" style={{ marginTop: '40px', marginBottom: '15px' }}>
                                <h2>PEDIR A DOMICILIO</h2>
                            </div>

                            <div className="delivery-grid" style={{ gridTemplateColumns: '1fr' }}>
                                {theme.socials.uberEats && (
                                    <a href={theme.socials.uberEats} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                                        <button className="delivery-btn" style={{ 
                                            background: '#06C167', width: '100%', height: '100%', 
                                            border: '3px solid #000', borderRadius: '8px', boxShadow: '4px 4px 0px 0px #000', 
                                            fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.4rem', color: '#fff', textShadow: '1px 1px 0px #000' 
                                        }}>
                                            {theme.socials.uberEatsLabel || 'PEDIR EN UBER EATS'}
                                        </button>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer id="contact" className="landing-footer">
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

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

                    <div style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
                            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.8rem', color: 'white', letterSpacing: '2px' }}>{theme.restaurantName} <span style={{ color: 'var(--secondary)' }}>{theme.restaurantSuffix}</span></span>
                            <img src={theme.brand.logoHeader || theme.brand.logoFallback} alt={theme.restaurantName} style={{ height: '40px' }} onError={(e) => e.target.src = theme.brand.logoFallback} />
                        </div>

                        <p style={{ margin: 0 }}>{theme.brand.footerText}</p>
                        <p style={{ fontSize: '0.8rem', marginTop: '10px', margin: '10px 0 0' }}>
                            Dev by <a href="https://ayoubjerari.com" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 'bold' }}>AyoubDev</a>
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
