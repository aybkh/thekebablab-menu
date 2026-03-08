import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTenant } from '../../context/TenantContext';

const CategorySidebar = ({ categories, selectedCategory, onSelectCategory, isMobileVisible }) => {
    const { getCategoryName } = useLanguage();
    const { theme } = useTenant();

    return (
        <aside className={`category-sidebar ${isMobileVisible ? 'mobile-visible' : ''}`} style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, overflowY: 'auto' }}>
                <div className="brand-title desktop-only">
                    <img src={theme.brand.logoFallback} alt={theme.restaurantName} className="brand-logo"
                        onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
                </div>

                {categories.map(cat => {
                    const cleanCatName = (cat.name || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');

                    const getCategoryIcon = (name) => {
                        const lowerName = (name || "").toLowerCase();
                        if (lowerName.includes('taco')) return '/categories/taco.svg';
                        if (lowerName.includes('burger') || lowerName.includes('hamburguesa')) return '/categories/burger.svg';
                        if (lowerName.includes('pizza')) return '/categories/pizza.svg';
                        if (lowerName.includes('bocadillo') || lowerName.includes('sandwich')) return '/categories/sandwitch.svg';
                        if (lowerName.includes('café') || lowerName.includes('cafe')) return '/categories/coffee.svg';
                        if (lowerName.includes('postre') || lowerName.includes('tarta') || lowerName.includes('helado')) return '/categories/dessert.svg';
                        if (lowerName.includes('refresco') || lowerName.includes('agua') || lowerName.includes('bebida')) return '/categories/drink.svg';
                        if (lowerName.includes('plato')) return '/categories/plato.svg';
                        if (lowerName.includes('ensalada')) return '/categories/salad.svg';
                        if (lowerName.includes('salsa')) return '/categories/salsas.svg';
                        if (lowerName.includes('batido')) return '/categories/shake.svg';
                        if (lowerName.includes('tajin')) return '/categories/tajin.svg';
                        if (lowerName.includes('wrap')) return '/categories/wraps.svg';
                        if (lowerName.includes('suplemento') || lowerName.includes('extra')) return '/categories/suplementos.svg';
                        return '/categories/default.svg';
                    };

                    return (
                        <div key={cat.id} className={`cat-btn ${selectedCategory?.id === cat.id ? 'active' : ''}`}
                            onClick={() => onSelectCategory(cat)}
                            style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5px', height: '90px' }}>

                            <img src={getCategoryIcon(cat.name)} alt="" className="cat-img-svg"
                                style={{ width: '100%', height: '100%', objectFit: 'contain', opacity: '0.9' }}
                                onError={(e) => { e.target.src = '/categories/default.svg'; }} />

                            <span className="cat-text-dynamic" style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: '95%',
                                fontSize: '1rem',
                                fontWeight: '900',
                                color: '#ffffff',
                                textAlign: 'center',
                                textTransform: 'uppercase',
                                lineHeight: '1.2',
                                wordBreak: 'break-word',
                                hyphens: 'auto',
                                textShadow: '2px 2px 4px rgba(0,0,0,0.9), 0px 0px 4px rgba(0,0,0,0.9), -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
                                zIndex: 10
                            }}>
                                {getCategoryName(cat)}
                            </span>
                        </div>
                    );
                })}

                <div style={{ padding: '20px 10px', textAlign: 'center', fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginTop: 'auto' }}>
                    Dev by <a href="https://ayoubjerari.com" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>AyoubDev</a>
                </div>
            </div>
        </aside>
    );
};

export default CategorySidebar;
