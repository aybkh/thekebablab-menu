import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTenant } from '../../context/TenantContext';
import '../../styles/pos/CategorySidebar.css';

const CategorySidebar = ({ categories, selectedCategory, onSelectCategory, isMobileVisible }) => {
    const { getCategoryName } = useLanguage();
    const { theme } = useTenant();

    const getCategoryIcon = (name) => {
        const lowerName = (name || "").toLowerCase();
        if (lowerName.includes('taco')) return '/categories/tacos.webp';
        if (lowerName.includes('dürüm')) return '/categories/durum.webp';
        if (lowerName.includes('pita')) return '/categories/pita.webp';
        if (lowerName.includes('batidos')) return '/categories/batidos_postres.webp';
        if (lowerName.includes('combo box')) return '/categories/combo_box.webp';
        if (lowerName.includes('combos') || (lowerName.includes('combo') && !lowerName.includes('box'))) return '/categories/combos.webp';
        if (lowerName.includes('menús') || lowerName.includes('menu')) return '/categories/menus.webp';
        if (lowerName.includes('entrantes')) return '/categories/tapas.webp';
        if (lowerName.includes('burger') || lowerName.includes('hamburguesa')) return '/categories/burger.webp';
        if (lowerName.includes('pizza')) return '/categories/pizza.webp';
        if (lowerName.includes('café') || lowerName.includes('cafe') || lowerName.includes('caliente')) return '/categories/bebidas_calientes.webp';
        if (lowerName.includes('postre') || lowerName.includes('tarta') || lowerName.includes('helado')) return '/categories/batidos_postres.webp';
        if (lowerName.includes('refresco') || lowerName.includes('agua') || lowerName.includes('bebida')) return '/categories/bebidas.webp';
        if (lowerName.includes('plato')) return '/categories/platos.webp';
        if (lowerName.includes('ensalada')) return '/categories/ensaladas.webp';
        if (lowerName.includes('salsa')) return '/categories/salsas.webp';
        if (lowerName.includes('batido')) return '/categories/batidos.webp';
        if (lowerName.includes('suplemento') || lowerName.includes('extra')) return '/categories/suplementos.webp';
        return '/categories/default.webp';
    };

    return (
        <aside className={`category-sidebar ${isMobileVisible ? 'mobile-visible' : ''}`}>
            <div className="brand-title desktop-only">
                <img src={theme.brand.logoFallback} alt={theme.restaurantName} className="brand-logo"
                    onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
            </div>

            {categories.map(cat => (
                <div key={cat.id} className={`cat-btn ${selectedCategory?.id === cat.id ? 'active' : ''}`}
                    onClick={() => onSelectCategory(cat)}>
                    <img src={getCategoryIcon(cat.name)} alt="" className="cat-img-svg"
                        onError={(e) => { e.target.src = '/categories/default.svg'; }} />
                </div>
            ))}

            <div className="sidebar-footer">
                Dev by <a href="https://ayoubjerari.com" target="_blank" rel="noopener noreferrer" className="sidebar-footer-link">AyoubDev</a>
            </div>
        </aside>
    );
};

export default CategorySidebar;
