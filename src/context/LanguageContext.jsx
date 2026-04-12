
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
        if (!key) return "";

        const langData = resources[language]?.ui;
        // 1. EXACT match in .ui (highest priority, avoids breaking existing flat keys with dots)
        if (langData && langData[key]) return langData[key];

        // 2. Fallback to ES exact match in .ui
        const esData = resources['es']?.ui;
        if (esData && esData[key]) return esData[key];

        // 3. Dot traversal starting from top level (for pizza_custom.itemX)
        const parts = key.split('.');
        let current = resources[language];
        for (const p of parts) {
            if (current && current[p]) current = current[p];
            else { current = null; break; }
        }
        if (current && typeof current === 'string') return current;

        // 4. Dot traversal starting from ES top level
        let esCurrent = resources['es'];
        for (const p of parts) {
            if (esCurrent && esCurrent[p]) esCurrent = esCurrent[p];
            else { esCurrent = null; break; }
        }
        if (esCurrent && typeof esCurrent === 'string') return esCurrent;

        return key;
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
