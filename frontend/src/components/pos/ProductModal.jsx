import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h2 className="modal-title" style={{ margin: 0, border: 0, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '1px', fontSize: '2rem' }}>{currentProduct.name}</h2>
                    <X size={28} style={{ cursor: 'pointer' }} onClick={onClose} />
                </div>

                {(() => {
                    const descKey = currentProduct.description || `desc_${currentProduct.id}`;
                    let translatedDesc = t(descKey);
                    if (translatedDesc === descKey && !currentProduct.description) return null;
                    if (translatedDesc === descKey) translatedDesc = currentProduct.description;

                    if (!translatedDesc) return null;

                    return (
                        <div style={{
                            marginBottom: '20px', color: '#555', fontSize: '0.95rem',
                            lineHeight: '1.5', fontFamily: 'Montserrat, sans-serif',
                            padding: '10px', background: 'rgba(0,0,0,0.02)', borderRadius: '8px', borderLeft: '3px solid var(--secondary)'
                        }}>
                            <i>{translatedDesc}</i>
                        </div>
                    );
                })()}

                {/* Variants (Sizes) */}
                {currentProduct.variants?.length > 0 && (
                    <div style={{ marginBottom: '25px' }}>
                        <span className="section-title">{t('available_sizes')}</span>
                        <div className="selection-grid" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
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
                    <div style={{ marginBottom: '25px' }}>
                        <span className="section-title">{t('meats_label')}</span>
                        <div className="selection-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
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
                                        {meat === "Tenders" && <span style={{ fontSize: '0.8em', marginLeft: '5px' }}>(+1.00€)</span>}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Base for Batidos */}
                {category?.name === "Batidos" && (
                    <div style={{ marginBottom: '25px' }}>
                        <span className="section-title">{t('base_label')}</span>
                        <div className="selection-grid" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {["Agua", "Leche", "Zumo de Naranja"].map(base => {
                                const translatedBase = getTranslatedProduct({ name: base })?.name || base;
                                return (
                                    <button key={base} className={`option-btn ${selectedLiquidBase === base ? 'selected' : ''}`}
                                        onClick={() => setSelectedLiquidBase(base)}>
                                        {translatedBase}
                                        {base === "Zumo de Naranja" && <span style={{ fontSize: '0.8em', marginLeft: '5px' }}>(+0.50€)</span>}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Redirect to Sauces Logic */}
                {(((category?.name || "").includes("Tacos")) || ((category?.name || "").includes("Bocadillos")) || ((category?.name || "").includes("Hamburguesas")) || (originalProduct?.name || "").toLowerCase().includes("taco") || (originalProduct?.name || "").toLowerCase().includes("burger")) && (
                    <div style={{ marginBottom: '25px' }}>
                        <span className="section-title">{t('sauces_label')}</span>
                        <div style={{ marginTop: '10px' }}>
                            <button
                                className="btn-secondary"
                                style={{
                                    width: '100%', padding: '12px', background: 'var(--bg-base)', color: 'white',
                                    borderRadius: '8px', border: 'none', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                                    fontWeight: 'bold', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                }}
                                onClick={onScrollToSauces}
                            >
                                <span>➔</span>
                                {t('go_to_sauces')}
                            </button>
                            <p style={{ fontSize: '0.8rem', color: '#888', textAlign: 'center', marginTop: '8px', fontStyle: 'italic' }}>
                                {t('go_to_sauces_desc')}
                            </p>
                        </div>
                    </div>
                )}

                {/* Menu Upgrade */}
                {(currentProduct.is_menu_compatible || currentProduct.isMenuCompatible) && (
                    <div style={{ marginBottom: '20px', padding: '15px', background: 'rgba(0,0,0,0.03)', borderRadius: '8px', border: '1px dashed #ccc' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer' }}>
                            <input type="checkbox" checked={isMenuUpgrade} onChange={(e) => setIsMenuUpgrade(e.target.checked)} style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }} />
                            <div>
                                <div style={{ fontWeight: 'bold', color: isMenuUpgrade ? 'var(--primary)' : 'inherit' }}>{t('menu_upgrade_title')}</div>
                                <div style={{ fontSize: '0.85rem', color: '#666' }}>{t('menu_upgrade_desc')}</div>
                            </div>
                        </label>
                    </div>
                )}

                <button className="btn-primary" style={{ width: '100%', marginTop: '10px', padding: '15px', border: '3px solid #000', borderRadius: '0', boxShadow: '4px 4px 0px #000', fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.4rem', letterSpacing: '1px' }} onClick={onClose}>
                    {t('close_total')}: {calculateTotal()}€
                </button>
            </div>
        </div>
    );
};

export default ProductModal;
