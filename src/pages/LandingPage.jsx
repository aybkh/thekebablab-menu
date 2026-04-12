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
import { useSiteConfig } from '../context/SiteConfigContext';
import { useLanguage } from '../context/LanguageContext';


const LandingPage = () => {
    const { theme } = useTenant();
    const { t } = useLanguage();
    const { siteConfig, isLoading: configLoading } = useSiteConfig();
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [currentBanner, setCurrentBanner] = useState(0);

    const heroMedia = siteConfig?.heroMedia || [];
    const socialVideos = siteConfig?.socialVideos || [];

    // Auto-slide Hero Media Logic (4s interval for images, videos handle their own onEnded)
    React.useEffect(() => {
        if (heroMedia.length === 0) return;
        const currentItem = heroMedia[currentBanner];
        if (currentItem?.type === 'image') {
            const timeout = setTimeout(() => {
                setCurrentBanner((prev) => (prev + 1) % heroMedia.length);
            }, 4000);
            return () => clearTimeout(timeout);
        }
    }, [currentBanner, heroMedia]);

    const handleHeroVideoEnd = () => {
        nextHeroMedia();
    };

    const nextHeroMedia = () => {
        setCurrentBanner((prev) => (prev + 1) % heroMedia.length);
    };

    const prevHeroMedia = () => {
        setCurrentBanner((prev) => (prev - 1 + heroMedia.length) % heroMedia.length);
    };


    const nextSocialVideo = () => {
        setCurrentVideoIndex((prev) => (prev + 1) % socialVideos.length);
    };

    const prevSocialVideo = () => {
        setCurrentVideoIndex((prev) => (prev - 1 + socialVideos.length) % socialVideos.length);
    };

    if (configLoading) return null;

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
                            {heroMedia.length > 0 && (
                                <>
                                    {heroMedia[currentBanner].type === 'image' ? (
                                        <img
                                            key={currentBanner}
                                            src={heroMedia[currentBanner].src}
                                            alt="Hero Slide"
                                            className="hero-slide active"
                                        />
                                    ) : (
                                        <video
                                            key={currentBanner}
                                            src={heroMedia[currentBanner].src}
                                            autoPlay
                                            muted
                                            playsInline
                                            onEnded={handleHeroVideoEnd}
                                            className="hero-slide active"
                                            style={{ objectFit: 'cover' }}
                                        />
                                    )}
                                    
                                    {/* Navigation Arrows */}
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); prevHeroMedia(); }} 
                                        className="hero-arrow-btn hero-arrow-prev"
                                        aria-label={t('hero_prev')}
                                    >
                                        <ChevronLeft size={24} />
                                    </button>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); nextHeroMedia(); }} 
                                        className="hero-arrow-btn hero-arrow-next"
                                        aria-label={t('hero_next')}
                                    >
                                        <ChevronRight size={24} />
                                    </button>
                                </>
                            )}
                        </div>

                        <p className="hero-subtitle">
                            {t('hero_subtitle')}
                        </p>

                        <div className="hero-buttons">
                            <Link to="/menu" className="hero-link-wrapper">
                                {/* NEW BUTTON STYLE: Hero Badge Style (Outline Gold + Glass) */}
                                <button className="hero-main-btn">
                                    {t('view_menu_btn')}
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
                                    key={socialVideos[currentVideoIndex]?.src}
                                    src={socialVideos[currentVideoIndex]?.src}
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
                                {/* Victor Prous Badge */}
                                <img 
                                    src="/images/victorprous_badge.webp" 
                                    alt="Victor Prous Badge" 
                                    className="victor-badge"
                                />

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
                                        {socialVideos[currentVideoIndex]?.title}
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
                        <h2>{t('location_title')}</h2>
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
                                    {t('view_map_btn')} ➔
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
                        <h2>{t('hours_title')}</h2>
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
                        {theme.contact.phone && <a href={`tel:${theme.contact.phone.replace(/\s+/g, '')}`} className="social-btn"><Phone size={22} /></a>}
                    </div>

                    <div className="text-center">

                        <p className="m-0">{theme.brand.footerText}</p>
                        <p className="footer-dev-text">
                            <a href="https://ayoubjerari.com" target="_blank" rel="noreferrer" className="dev-link">
                                {t('footer_dev_by')} <span className="dev-name">AYOUBDEV</span>
                            </a>
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
