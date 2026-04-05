import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, MapPin, Clock, Phone, Utensils, Bike } from 'lucide-react';
import { useTenant } from '../../context/TenantContext';
import { useLanguage } from '../../context/LanguageContext';
import LanguageSelector from '../LanguageSelector';

const Navbar = () => {
    const { theme } = useTenant();
    const { t, language, setLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // Scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavClick = (hash) => {
        setIsOpen(false);
        if (location.pathname !== '/') {
            navigate('/' + hash);
            setTimeout(() => {
                const el = document.getElementById(hash.replace('#', ''));
                if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            const el = document.getElementById(hash.replace('#', ''));
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const navItems = [
        { label: t('nav_home'), hash: '#hero' },
        { label: t('nav_location'), hash: '#location' },
        { label: t('nav_hours'), hash: '#hours' },
        { label: t('nav_delivery'), hash: '#delivery' },
        { label: t('nav_contact'), hash: '#contact' }
    ];

    // Removed getHash as it is now part of navItems object

    return (
        <nav className={`landing-nav ${scrolled || isOpen ? 'scrolled' : 'transparent'} ${isOpen ? 'open' : ''}`}>
            <div className="nav-container">
                {/* Header Container */}
                <div className="nav-content">

                    {/* Left Section: Mobile Menu Button */}
                    <div className="nav-left-section">
                        <button onClick={() => setIsOpen(!isOpen)} className="nav-btn-mobile">
                            {isOpen ? <X size={30} /> : <Menu size={30} />}
                        </button>
                    </div>

                    {/* Center/Main Section: Desktop Menu Links */}
                    <div className="nav-menu-section desktop-only">
                        {navItems.map((item, idx) => (
                            <button key={idx} onClick={() => handleNavClick(item.hash)}
                                className="nav-link-btn">
                                {item.label}
                            </button>
                        ))}

                        <Link to="/menu" target="_blank" rel="noopener noreferrer" className="no-underline">
                            <button className="nav-link-btn btn-order-style">
                                {t('view_menu_btn')}
                            </button>
                        </Link>

                        <div className="ml-4">
                            <LanguageSelector currentLang={language} onLanguageChange={setLanguage} />
                        </div>
                    </div>

                    {/* Logo Section (Centered in CSS) */}
                    <div className="nav-logo-section">
                        <img 
                            src={theme.brand.logoHeader || theme.brand.logoFallback} 
                            alt="Logo" 
                            className="nav-logo-right"
                            onError={(e) => e.target.src = theme.brand.logoFallback} 
                            onClick={() => {
                                if (location.pathname === '/') {
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                } else {
                                    navigate('/');
                                }
                            }}
                        />
                    </div>

                    {/* Right Section: Mobile Language Selector */}
                    <div className="nav-right-section mobile-only">
                        <LanguageSelector currentLang={language} onLanguageChange={setLanguage} />
                    </div>
                </div>
            </div>

            {/* Mobile Sidebar/Drawer */}
            <div className={`nav-mobile-sidebar ${isOpen ? 'open' : ''}`}>
                {navItems.map((item, idx) => {
                    let Icon = null;
                    if (item.hash === '#location') Icon = MapPin;
                    else if (item.hash === '#hours') Icon = Clock;
                    else if (item.hash === '#delivery') Icon = Bike;
                    else if (item.hash === '#contact') Icon = Phone;

                    return (
                        <button key={idx} onClick={() => handleNavClick(item.hash)} className="nav-mobile-item">
                            {Icon && <Icon size={24} color="var(--color-primary)" />}
                            {item.label}
                        </button>
                    );
                })}
                <div className="mt-auto mb-5">
                    <Link to="/menu" target="_blank" rel="noopener noreferrer" className="no-underline" onClick={() => setIsOpen(false)}>
                        <button className="nav-mobile-order-btn">
                            <Utensils size={28} /> {t('view_menu_btn')}
                        </button>
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
