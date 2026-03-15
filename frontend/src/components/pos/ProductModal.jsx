import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import PriceDisplay from '../shared/PriceDisplay';
import { ALLERGEN_MAP } from '../landing/AllergenIcons';
import '../../styles/pos/ProductModal.css';

const ProductModal = ({ isOpen, onClose, originalProduct, category, onScrollToSauces }) => {
    const { t, getTranslatedProduct } = useLanguage();

    // Internal State
    const [currentProduct, setCurrentProduct] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [selectedSauces, setSelectedSauces] = useState([]);
    const [isMenuUpgrade, setIsMenuUpgrade] = useState(false);
    const [hasDrink, setHasDrink] = useState(false);
    const [selectedLiquidBase, setSelectedLiquidBase] = useState(null);

    // Initialize state when product changes
    useEffect(() => {
        if (isOpen && originalProduct) {
            const translated = getTranslatedProduct(originalProduct);
            setCurrentProduct(translated);

            // Set default variant
            const defaultVariant = translated.variants && translated.variants.length > 0 ? translated.variants[0] : null;
            setSelectedVariant(defaultVariant);

            // Reset selection
            setIsMenuUpgrade(false);
            setHasDrink(false);
            setSelectedSauces([]);
            setSelectedLiquidBase(null);
        }
    }, [isOpen, originalProduct, getTranslatedProduct]);

    if (!isOpen || !currentProduct) return null;

    // Helper to calculate total
    const calculateTotal = () => {
        const base = selectedVariant ? Number(selectedVariant.price) : Number(currentProduct.price || currentProduct.base_price || 0);
        const menuExtra = isMenuUpgrade ? 2.0 : 0;
        const drinkExtra = hasDrink ? 1.50 : 0;
        const sauceExtra = Math.max(0, selectedSauces.length - 2) * 0.25;
        const batidoExtra = (category?.name === "Batidos" && selectedLiquidBase === "Zumo de Naranja") ? 0.50 : 0;
        return (base + menuExtra + drinkExtra + sauceExtra + batidoExtra).toFixed(2);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2 className="modal-title">{currentProduct.name}</h2>
                    <button className="modal-close-btn" onClick={onClose}>
                        <X size={28} />
                    </button>
                </div>

                {(() => {
                    const descKey = currentProduct.description || `desc_${currentProduct.id}`;
                    let translatedDesc = t(descKey);
                    if (translatedDesc === descKey && !currentProduct.description) return null;
                    if (translatedDesc === descKey) translatedDesc = currentProduct.description;

                    if (!translatedDesc) return null;

                    return (
                        <div className="product-description-box">
                            <i>{translatedDesc}</i>
                        </div>
                    );
                })()}

                {originalProduct?.alergenos && originalProduct.alergenos.length > 0 && (
                    <div className="product-allergens-section">
                        <span className="section-title">{t('allergens_label')}</span>
                        <div className="product-allergens-list">
                            {originalProduct.alergenos.map(id => {
                                const alg = ALLERGEN_MAP[id];
                                if (!alg) return null;
                                return (
                                    <div key={id} className="allergen-info-item">
                                        <img 
                                            src={alg.iconSrc} 
                                            alt={alg.name} 
                                            className="allergen-mini-icon" 
                                            onError={(e) => { 
                                                e.target.style.display = 'none'; 
                                                if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex'; 
                                            }} 
                                        />
                                        <div className="allergen-fallback-mini" style={{ display: 'none', borderColor: alg.color }}>
                                            {alg.emoji}
                                        </div>
                                        <span className="allergen-info-name">{t('allergen_' + id) || alg.name}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Variants (Sizes) */}
                {currentProduct.variants?.length > 0 && (
                    <div className="selection-container">
                        <span className="section-title">{t('available_sizes')}</span>
                        <div className="selection-grid">
                            {currentProduct.variants.map(v => (
                                <button key={v.id} className={`option-btn ${selectedVariant?.id === v.id ? 'selected' : ''}`}
                                    onClick={() => setSelectedVariant(v)}>
                                    {v.name} - <PriceDisplay price={v.price} />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Base for Batidos */}
                {category?.name === "Batidos" && (
                    <div className="selection-container">
                        <span className="section-title">{t('base_label')}</span>
                        <div className="selection-grid">
                            {["Agua", "Leche", "Zumo de Naranja"].map(base => {
                                const translatedBase = getTranslatedProduct({ name: base })?.name || base;
                                return (
                                    <button key={base} className={`option-btn ${selectedLiquidBase === base ? 'selected' : ''}`}
                                        onClick={() => setSelectedLiquidBase(base)}>
                                        {translatedBase}
                                        {base === "Zumo de Naranja" && <span className="extra-price">(+<PriceDisplay price={0.50} />)</span>}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Redirect to Sauces Logic */}
                {(((category?.name || "").includes("Tacos")) || ((category?.name || "").includes("Bocadillos")) || ((category?.name || "").includes("Hamburguesas")) || (originalProduct?.name || "").toLowerCase().includes("taco") || (originalProduct?.name || "").toLowerCase().includes("burger")) && (
                    <div className="sauces-redirect-container">
                        <span className="section-title">{t('sauces_label')}</span>
                        <div style={{ marginTop: '10px' }}>
                            <button className="go-to-sauces-btn" onClick={onScrollToSauces}>
                                <span>➔</span>
                                {t('go_to_sauces')}
                            </button>
                            <p className="go-to-sauces-desc">
                                {t('go_to_sauces_desc')}
                            </p>
                        </div>
                    </div>
                )}

                {/* Menu Upgrade */}
                {(currentProduct.is_menu_compatible || currentProduct.isMenuCompatible) && (
                    <div className="menu-upgrade-box">
                        <label className="menu-upgrade-label">
                            <input type="checkbox" className="menu-upgrade-checkbox" checked={isMenuUpgrade} onChange={(e) => setIsMenuUpgrade(e.target.checked)} />
                            <div>
                                <div className={`menu-upgrade-title ${isMenuUpgrade ? 'active' : ''}`}>{t('menu_upgrade_title')}</div>
                                <div className="menu-upgrade-desc">{t('menu_upgrade_desc')}</div>
                            </div>
                        </label>
                    </div>
                )}

                <button className="btn-primary modal-footer-btn" onClick={onClose}>
                    {t('close_total')}: <PriceDisplay price={calculateTotal()} />
                </button>
            </div>
        </div>
    );
};

export default ProductModal;
