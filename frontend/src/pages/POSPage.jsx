import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getMenu } from '../api';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from '../components/LanguageSelector';
import { useTenant } from '../context/TenantContext';

// Modular Components
import WelcomeScreen from '../components/pos/WelcomeScreen';
import CategorySidebar from '../components/pos/CategorySidebar';
import ProductCard from '../components/pos/ProductCard';
import ProductModal from '../components/pos/ProductModal';

import '../styles/pos/POSPage.css';

// Helper normalization function requested by user
const normalizeId = (str) => {
    if (!str) return '';
    return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
};

const POSPage = () => {
    const { t, getCategoryName, language, setLanguage } = useLanguage();
    const { theme } = useTenant();

    // App Flow State
    const [step, setStep] = useState('welcome');

    // UI State
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null); // Used for Sidebar Highlight & Modal Logic
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState({ product: null, category: null });

    // Refs for Scroll Spy
    const mainContainerRef = useRef(null);

    useEffect(() => {
        loadMenu();
    }, []);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [step]);

    const loadMenu = async () => {
        try {
            const data = await getMenu();
            setCategories(data);
            if (data.length > 0) setSelectedCategory(data[0]);
        } catch (err) {
            console.error("Failed to load menu", err);
        }
    };

    // --- SCROLL SPY LOGIC ---
    useEffect(() => {
        if (step !== 'pos') return;

        const handleScroll = () => {
            let currentCatId = null;
            // Check explicit elements relative to viewport
            for (const cat of categories) {
                const normalizedStr = normalizeId(cat.name);
                const el = document.getElementById(`category-${normalizedStr}`);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    if (rect.top <= 150 && rect.bottom >= 150) {
                        currentCatId = cat.id;
                        break;
                    }
                }
            }

            if (currentCatId && (!selectedCategory || selectedCategory.id !== currentCatId)) {
                const matchedCat = categories.find(c => c.id === currentCatId);
                if (matchedCat) setSelectedCategory(matchedCat);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [categories, step, selectedCategory]);


    const scrollToCategory = (cat) => {
        setSelectedCategory(cat);
        setIsMobileMenuOpen(false);
        const normalizedStr = normalizeId(cat.name);
        const el = document.getElementById(`category-${normalizedStr}`);
        if (el) {
            // Smaller offset for mobile to account for smaller header
            const isMobile = window.innerWidth <= 1024;
            const yOffset = isMobile ? -62 : -20;
            const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    const handleProductClick = (prodOriginal, prodCategory) => {
        // Crucial: Update selected category to ensure Modal Logic works correctly
        setSelectedCategory(prodCategory);
        setModalData({ product: prodOriginal, category: prodCategory });
        setIsModalOpen(true);
    };

    const handleScrollToSauces = () => {
        const salsasCat = categories.find(c => c.name === "Salsas");
        if (salsasCat) {
            setIsModalOpen(false);
            scrollToCategory(salsasCat);
        } else {
            console.warn("Category 'Salsas' not found");
        }
    };

    if (step === 'welcome') {
        return <WelcomeScreen onStart={() => setStep('pos')} />;
    }

    return (
        <div className="app-container">
            <header className="mobile-header">
                <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
                <div className="mobile-logo-container">
                    <Link to="/">
                        <img src={theme.brand.logoFallback} alt={theme.restaurantName} className="mobile-logo"
                            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
                    </Link>
                </div>
                <LanguageSelector currentLang={language} onLanguageChange={setLanguage} />
            </header>

            <CategorySidebar
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={scrollToCategory}
                isMobileVisible={isMobileMenuOpen}
            />

            {/* Mobile Menu Backdrop */}
            {isMobileMenuOpen && (
                <div 
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.6)',
                        zIndex: 40,
                        backdropFilter: 'blur(2px)'
                    }}
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            <main className="product-area" ref={mainContainerRef}>
                {categories.length === 0 ? (
                    <div className="updating-menu-container">
                        <div className="updating-menu-icon">🚧</div>
                        <h2 className="updating-menu-title font-black-ops">ESTAMOS ACTUALIZANDO NUESTRO MENÚ</h2>
                        <p className="updating-menu-text">El catálogo se está sincronizando en estos momentos. Por favor, vuelve a intentarlo en unos minutos.</p>
                    </div>
                ) : (
                    categories.map((category) => {
                        const normalizedStr = normalizeId(category.name);
                        return (
                            <section key={category.id} id={`category-${normalizedStr}`} className="mb-0">
                                {/* Sticky Header */}
                                <div className="category-section-header">
                                    <h2 className="category-title">
                                        | {getCategoryName(category)}
                                    </h2>
                                </div>

                                {/* Products Grid */}
                                <div className="product-grid">
                                    {category.products.length === 0 ? (
                                        <div className="empty-category-msg">
                                            {t('empty_category')}
                                        </div>
                                    ) : (
                                        category.products.map((originalProd, index) => (
                                            <div key={originalProd.id || `${category.id}-${index}`}>
                                                <ProductCard
                                                    originalProd={originalProd}
                                                    category={category}
                                                    onClick={() => handleProductClick(originalProd, category)}
                                                />
                                            </div>
                                        ))
                                    )}
                                </div>
                            </section>
                        );
                    })
                )}

                {/* Footer Spacer */}
                <div className="pos-footer-spacer">
                    Dev by <a href="https://ayoubjerari.com" target="_blank" rel="noopener noreferrer" className="pos-footer-link">AyoubDev</a>
                </div>
            </main>

            <ProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                originalProduct={modalData.product}
                category={modalData.category}
                onScrollToSauces={handleScrollToSauces}
            />
        </div >
    );
};

export default POSPage;
