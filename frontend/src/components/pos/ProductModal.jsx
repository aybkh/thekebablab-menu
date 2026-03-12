import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import '../../styles/pos/ProductModal.css';

const KNOWN_MEATS = [
    "Carne Picada", "Pollo", "Nuggets", "Cordon Bleu",
    "Tenders", "Kefta", "Salchicha", "Kebab"
];

const ProductModal = ({ isOpen, onClose, originalProduct, category, onScrollToSauces }) => {
    const { t, getTranslatedProduct } = useLanguage();

    // Internal State
    const [currentProduct, setCurrentProduct] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [selectedMeats, setSelectedMeats] = useState([]);
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

            // Set default meats
            if (KNOWN_MEATS.includes(originalProduct.name)) {
                setSelectedMeats([originalProduct.name]);
            } else {
                setSelectedMeats([]);
            }

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
        const tendersExtra = selectedMeats.includes("Tenders") ? 1.00 : 0;
        return (base + menuExtra + drinkExtra + sauceExtra + batidoExtra + tendersExtra).toFixed(2);
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

                {/* Variants (Sizes) */}
                {currentProduct.variants?.length > 0 && (
                    <div className="selection-container">
                        <span className="section-title">{t('available_sizes')}</span>
                        <div className="selection-grid">
                            {currentProduct.variants.map(v => (
                                <button key={v.id} className={`option-btn ${selectedVariant?.id === v.id ? 'selected' : ''}`}
                                    onClick={() => setSelectedVariant(v)}>
                                    {v.name} - {v.price}€
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Meats Logic */}
                {(((category?.name || "").includes("Tacos")) || ((category?.name || "").includes("Bocadillos") && originalProduct.name?.includes("Mixto")) || (originalProduct?.name || "").toLowerCase().includes("taco")) && (
                    <div className="selection-container">
                        <span className="section-title">{t('meats_label')}</span>
                        <div className="selection-grid">
                            {["Carne Picada", "Pollo", "Nuggets", "Cordon Bleu", "Tenders"].map(meat => {
                                const isSelected = selectedMeats.includes(meat);
                                const translatedMeat = getTranslatedProduct({ name: meat })?.name || meat;
                                return (
                                    <button key={meat} className={`option-btn ${isSelected ? 'selected' : ''}`}
                                        onClick={() => {
                                            const currentName = (selectedVariant?.name || originalProduct.name || "").toUpperCase();
                                            let maxAllowed = 1;

                                            if (currentName.includes("MIXTO")) maxAllowed = 2;
                                            else if (currentName.includes("XXL") || currentName.includes("MAXI")) maxAllowed = 3;
                                            else if (currentName.includes("XL")) maxAllowed = 3;
                                            else if (currentName.includes(" L") || currentName.endsWith("L") || currentName.includes("LARGE") || currentName.includes("DOBLE") || currentName.includes("DOUBLE")) maxAllowed = 2;

                                            if (isSelected) setSelectedMeats(selectedMeats.filter(m => m !== meat));
                                            else if (selectedMeats.length < maxAllowed) {
                                                setSelectedMeats([...selectedMeats, meat]);
                                            }
                                        }}>
                                        {translatedMeat}
                                        {meat === "Tenders" && <span className="extra-price">(+1.00€)</span>}
                                    </button>
                                );
                            })}
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
                                        {base === "Zumo de Naranja" && <span className="extra-price">(+0.50€)</span>}
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
                    {t('close_total')}: {calculateTotal()}€
                </button>
            </div>
        </div>
    );
};

export default ProductModal;
