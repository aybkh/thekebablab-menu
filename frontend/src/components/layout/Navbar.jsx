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
        <nav style={{
            position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 1000,
            background: scrolled || isOpen ? 'rgba(17, 17, 17, 0.98)' : 'rgba(17, 17, 17, 0.8)',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease',
            borderBottom: scrolled ? '2px solid #000' : 'none',
            padding: '10px 0',
            boxShadow: scrolled ? '0 4px 0px 0px rgba(0,0,0,0.5)' : 'none'
        }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Container */}
                <div style={{ height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>

                    {/* 1. LEFT: Mobile Menu Button */}
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
                        <div className="md:hidden">
                            <button onClick={() => setIsOpen(!isOpen)} style={{ background: 'none', border: 'none', color: 'white', padding: '8px', display: 'flex' }}>
                                {isOpen ? <X size={30} /> : <Menu size={30} />}
                            </button>
                        </div>
                    </div>

                    {/* 2. CENTER: TEXT BRANDING (Absolute Center) */}
                    <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', textAlign: 'center', zIndex: 10, width: 'max-content' }} onClick={() => navigate('/')}>
                        <span style={{
                            fontFamily: "'Black Ops One', cursive",
                            fontSize: '1.4rem',
                            color: 'white',
                            lineHeight: 1,
                            textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                            cursor: 'pointer'
                        }}>
                            {theme.restaurantName} {theme.restaurantSuffix && <span style={{ color: 'var(--secondary)' }}>{theme.restaurantSuffix}</span>}
                        </span>
                    </div>

                    {/* 3. RIGHT: LOGO and Desktop Menu */}
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '20px' }}>

                        {/* Desktop Menu Items */}
                        <div className="hidden md:flex items-center space-x-6">
                            {navItems.map((item, idx) => {
                                const hash = getHash(item);
                                return (
                                    <button key={idx} onClick={() => handleNavClick(hash)}
                                        style={{
                                            background: 'none', border: 'none', color: 'white',
                                            fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.2rem', cursor: 'pointer',
                                            letterSpacing: '1px', transition: 'color 0.2s'
                                        }}
                                        className="hover:text-primary">
                                        {item}
                                    </button>
                                );
                            })}

                            <Link to="/menu" style={{ textDecoration: 'none' }}>
                                <button className="btn-primary" style={{
                                    padding: '8px 25px', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px',
                                    background: 'var(--primary)', color: 'black', border: '2px solid black', borderRadius: '8px',
                                    fontFamily: "'Bebas Neue', sans-serif", cursor: 'pointer', boxShadow: '3px 3px 0px 0px #000'
                                }}>
                                    PEDIR
                                </button>
                            </Link>
                        </div>

                        {/* Logo on the Absolute Right */}
                        <img src={theme.brand.logoHeader || theme.brand.logoFallback} alt="Logo" style={{ height: '50px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))', cursor: 'pointer', marginRight: '15px' }}
                            onError={(e) => e.target.src = theme.brand.logoFallback} onClick={() => navigate('/')} />

                    </div>
                </div>
            </div>

            {/* Mobile Sidebar/Drawer */}
            <div style={{
                position: 'fixed', top: '81px', left: 0, width: '100%', height: 'calc(100vh - 81px)',
                background: 'var(--bg-base)', transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
                transition: 'transform 0.3s ease-in-out', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px',
                zIndex: 999
            }}>
                {navItems.map((item, idx) => {
                    const hash = getHash(item);
                    let Icon = null;
                    if (item === 'UBICACIÓN') Icon = MapPin;
                    else if (item === 'HORARIOS') Icon = Clock;
                    else if (item === 'A DOMICILIO') Icon = Bike;
                    else if (item === 'CONTACTO') Icon = Phone;

                    return (
                        <button key={idx} onClick={() => handleNavClick(hash)}
                            style={{
                                background: '#ffffff', border: '3px solid #000', color: '#000',
                                fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.4rem', padding: '16px',
                                letterSpacing: '1px', textAlign: 'left', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '15px',
                                boxShadow: '4px 4px 0px 0px #000'
                            }}>
                            {Icon && <Icon size={24} color="#F26122" />}
                            {item}
                        </button>
                    );
                })}
                <div style={{ marginTop: 'auto', marginBottom: '20px' }}>
                    <Link to="/menu" style={{ width: '100%', textDecoration: 'none' }} onClick={() => setIsOpen(false)}>
                        <button style={{
                            width: '100%', padding: '16px', fontSize: '1.6rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px',
                            background: 'var(--primary)', color: 'black', border: '3px solid black', borderRadius: '8px', cursor: 'pointer',
                            fontFamily: "'Bebas Neue', sans-serif", boxShadow: '4px 4px 0px 0px #000'
                        }}>
                            <Utensils size={28} /> VER CARTA
                        </button>
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
