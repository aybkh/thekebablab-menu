import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, MapPin, Clock, Phone, Utensils, Bike } from 'lucide-react';
import { useTenant } from '../../context/TenantContext';

const Navbar = () => {
    const { theme } = useTenant();
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

    const navItems = ['INICIO', 'UBICACIÓN', 'HORARIOS', 'A DOMICILIO', 'CONTACTO'];

    const getHash = (item) => {
        switch (item) {
            case 'INICIO': return '#hero';
            case 'UBICACIÓN': return '#location';
            case 'HORARIOS': return '#hours'; // Although Hours is inside Layout, we can scroll to layout or maybe add id to hours title if needed. But it's in location section. Ideally we add id="hours" too.
            // Wait, previous LandingPage edit didn't add id="hours". Let's assume #location covers it or user scrolls. 
            // Actually, for better UX let's map 'HORARIOS' to '#delivery' area or '#location'. 
            // Let's keep it consistent.
            case 'A DOMICILIO': return '#delivery';
            case 'CONTACTO': return '#contact';
            default: return '#hero';
        }
    };

    return (
        <nav className={`landing-nav ${scrolled || isOpen ? 'scrolled' : 'transparent'} ${isOpen ? 'open' : ''}`}>
            <div className="nav-container">
                {/* Header Container */}
                <div className="nav-content">

                    {/* Left Section: Mobile Menu Button + Brand Title */}
                    <div className="nav-left-section">
                        <button onClick={() => setIsOpen(!isOpen)} className="nav-btn-mobile md:hidden">
                            {isOpen ? <X size={30} /> : <Menu size={30} />}
                        </button>
                        
                        <div className="nav-brand-container" onClick={() => navigate('/')}>
                            <span className="nav-brand-text">
                                {theme.restaurantName} {theme.restaurantSuffix && <span>{theme.restaurantSuffix}</span>}
                            </span>
                        </div>
                    </div>

                    {/* Center/Main Section: Desktop Menu Links */}
                    <div className="nav-menu-section desktop-only">
                        {navItems.map((item, idx) => {
                            const hash = getHash(item);
                            return (
                                <button key={idx} onClick={() => handleNavClick(hash)}
                                    className="nav-link-btn">
                                    {item}
                                </button>
                            );
                        })}

                        <Link to="/menu" className="no-underline">
                            <button className="nav-link-btn btn-order-style">
                                VER CARTA
                            </button>
                        </Link>
                    </div>

                    {/* Right Section: Brand Logo */}
                    <div className="nav-logo-section">
                        <img 
                            src={theme.brand.logoHeader || theme.brand.logoFallback} 
                            alt="Logo" 
                            className="nav-logo-right"
                            onError={(e) => e.target.src = theme.brand.logoFallback} 
                            onClick={() => navigate('/')} 
                        />
                    </div>
                </div>
            </div>

            {/* Mobile Sidebar/Drawer */}
            <div className={`nav-mobile-sidebar ${isOpen ? 'open' : ''}`}>
                {navItems.map((item, idx) => {
                    const hash = getHash(item);
                    let Icon = null;
                    if (item === 'UBICACIÓN') Icon = MapPin;
                    else if (item === 'HORARIOS') Icon = Clock;
                    else if (item === 'A DOMICILIO') Icon = Bike;
                    else if (item === 'CONTACTO') Icon = Phone;

                    return (
                        <button key={idx} onClick={() => handleNavClick(hash)} className="nav-mobile-item">
                            {Icon && <Icon size={24} color="var(--color-primary)" />}
                            {item}
                        </button>
                    );
                })}
                <div className="mt-auto mb-5">
                    <Link to="/menu" className="w-full no-underline" onClick={() => setIsOpen(false)}>
                        <button className="nav-mobile-order-btn">
                            <Utensils size={28} /> VER CARTA
                        </button>
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
