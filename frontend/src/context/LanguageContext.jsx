
import React, { createContext, useContext, useState, useEffect } from 'react';
import { resources } from '../data/locales';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    // Default to Spanish, try to read from localStorage if you want persistence
    const [language, setLanguage] = useState(localStorage.getItem('kebab_lang') || 'es');

    const changeLanguage = (lang) => {
        setLanguage(lang);
        localStorage.setItem('kebab_lang', lang);
    };

    const t = (key) => {
        const langData = resources[language]?.ui;
        // Search in UI keys
        if (langData && langData[key]) return langData[key];

        // Fallback to ES
        return resources['es']?.ui[key] || key;
    };

    // Helper to get translated category name
    const getCategoryName = (category) => {
        if (!category) return "";
        const mapping = resources[language]?.categories;
        if (mapping && mapping[category.name]) return mapping[category.name];
        return category.name;
    };

    // Helper to translate product properties overlaying them on top of original
    const getTranslatedProduct = (product) => {
        if (!product) return null;
        const overrides = resources[language]?.products?.[product.name];

        const translated = { ...product };

        if (overrides) {
            if (overrides.name) translated.name = overrides.name;
            if (overrides.description) translated.description = overrides.description;
        }

        return translated;
    };

    // Direction (rtl/ltr)
    const dir = resources[language]?.direction || 'ltr';

    return (
        <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t, getCategoryName, getTranslatedProduct, dir }}>
            <div dir={dir} style={{ height: '100%', width: '100%' }}>
                {children}
            </div>
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
