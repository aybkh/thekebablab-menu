import React, { createContext, useContext, useState, useEffect } from 'react';

const SiteConfigContext = createContext(null);

export const SiteConfigProvider = ({ children }) => {
    const [siteConfig, setSiteConfig] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const response = await fetch('./site_config.json?t=' + new Date().getTime());
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const data = await response.json();
                setSiteConfig(data);
            } catch (err) {
                console.error("Error loading site_config.json:", err);
                // Fallback to empty defaults so the page still renders
                setSiteConfig({
                    heroMedia: [],
                    socialVideos: [],
                    featuredMenu: [],
                    reviews: [],
                    schedule: []
                });
            } finally {
                setIsLoading(false);
            }
        };
        fetchConfig();
    }, []);

    return (
        <SiteConfigContext.Provider value={{ siteConfig, setSiteConfig, isLoading }}>
            {children}
        </SiteConfigContext.Provider>
    );
};

export const useSiteConfig = () => {
    const context = useContext(SiteConfigContext);
    if (context === null) {
        throw new Error("useSiteConfig must be used within a SiteConfigProvider");
    }
    return context;
};
