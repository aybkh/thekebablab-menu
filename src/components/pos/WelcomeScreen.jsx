import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import LanguageSelector from '../LanguageSelector';
import { useTenant } from '../../context/TenantContext';
import '../../styles/pos/WelcomeScreen.css';

const WelcomeScreen = ({ onStart }) => {
    const { t, language, setLanguage } = useLanguage();
    const { theme } = useTenant();

    return (
        <div className="welcome-screen">
            <div className="welcome-header">
                <LanguageSelector currentLang={language} onLanguageChange={setLanguage} isWelcomeScreen={true} />
            </div>
            <button onClick={onStart} className="welcome-full-btn">
                <img src="/images/start.webp" alt="EMPEZAR" className="welcome-start-img" />
                <span className="welcome-start-text">
                    {t('start')}
                </span>
            </button>
        </div>
    );
};

export default WelcomeScreen;
