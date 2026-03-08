import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import LanguageSelector from '../LanguageSelector';
import { useTenant } from '../../context/TenantContext';

const WelcomeScreen = ({ onStart }) => {
    const { t, language, setLanguage } = useLanguage();
    const { theme } = useTenant();

    return (
        <div className="welcome-screen" style={{ position: 'relative' }}>
            <div style={{
                position: 'absolute', top: '20px', left: '20px', right: '20px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 10
            }}>
                <div style={{
                    fontFamily: 'Black Ops One, cursive', fontSize: '1.2rem', lineHeight: '1.2',
                    color: 'white', textShadow: '2px 2px 4px black', textAlign: 'center',
                    display: 'flex', flexDirection: 'column', alignItems: 'center'
                }}>
                    {theme.restaurantName.split(' ').map((word, idx) => (
                        <div key={idx}>{word.toUpperCase()}</div>
                    ))}
                    {theme.restaurantSuffix && <div style={{ color: 'var(--secondary)' }}>{theme.restaurantSuffix}</div>}
                </div>
                <LanguageSelector currentLang={language} onLanguageChange={setLanguage} isWelcomeScreen={true} />
            </div>
            <button
                onClick={onStart}
                className="welcome-full-btn"
                style={{
                    background: 'transparent', border: 'none', padding: 0, cursor: 'pointer',
                    width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'
                }}
            >
                <img src="/images/empezar.webp" alt="EMPEZAR" style={{ maxWidth: '90%', maxHeight: '60%', objectFit: 'contain', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))' }} />
                <span style={{ color: 'var(--secondary)', fontSize: '2.5rem', marginTop: '20px', fontFamily: "'Black Ops One', cursive", letterSpacing: '2px', textShadow: '2px 2px 4px black' }}>
                    {t('start')}
                </span>
            </button>
            <div style={{
                position: 'absolute', bottom: '10px', width: '100%', textAlign: 'center',
                color: 'rgba(255, 255, 255, 0.4)', fontSize: '0.7rem', fontFamily: 'Montserrat, sans-serif', zIndex: 5
            }}>
                Dev by <a href="https://ayoubjerari.com" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>AyoubDev</a>
            </div>
        </div>
    );
};

export default WelcomeScreen;
