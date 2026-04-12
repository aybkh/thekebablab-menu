import React, { createContext, useContext, useState, useEffect } from 'react';

const TenantContext = createContext(null);

export const TenantProvider = ({ children }) => {
    const [theme, setTheme] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTheme = async () => {
            try {
                // Fetch dynamic tenant config. Use timestamp to prevent hard caching
                const response = await fetch('/theme.json?t=' + new Date().getTime());
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setTheme(data);

                // Inject CSS variable colors into root if available
                if (data.colors) {
                    const root = document.documentElement;
                    Object.entries(data.colors).forEach(([key, value]) => {
                        root.style.setProperty(`--${key}`, value);
                    });
                }

                // Set Document Title and Meta overrides dynamically
                if (data.seo) {
                    if (data.seo.title) {
                        document.title = data.seo.title;
                        const ogTitle = document.querySelector('meta[property="og:title"]');
                        if (ogTitle) ogTitle.setAttribute("content", data.seo.title);
                    }
                    if (data.seo.description) {
                        const metaDesc = document.querySelector('meta[name="description"]');
                        if (metaDesc) metaDesc.setAttribute("content", data.seo.description);
                        const ogDesc = document.querySelector('meta[property="og:description"]');
                        if (ogDesc) ogDesc.setAttribute("content", data.seo.description);
                    }
                    if (data.seo.keywords) {
                        const metaKeywords = document.querySelector('meta[name="keywords"]');
                        if (metaKeywords) metaKeywords.setAttribute("content", data.seo.keywords);
                    }
                }
            } catch (err) {
                console.error("Error loading theme.json. White Label config failed:", err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTheme();
    }, []);

    const value = {
        theme,
        isLoading,
        error
    };

    return (
        <TenantContext.Provider value={value}>
            {children}
        </TenantContext.Provider>
    );
};

// Custom Hook to access tenant config
export const useTenant = () => {
    const context = useContext(TenantContext);
    if (context === null) {
        throw new Error("useTenant must be used within a TenantProvider");
    }
    return context;
};
