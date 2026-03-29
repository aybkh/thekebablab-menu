import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import PriceDisplay from '../shared/PriceDisplay';
import { ALLERGEN_MAP } from '../landing/AllergenIcons';
import '../../styles/pos/ProductModal.css';

const PIZZA_CUSTOM_GROUPS = [
    { key: "bases", type: "radio", items: ["Tomate", "Barbacoa", "Crema/Nata"] },
    { key: "quesos", type: "checkbox", items: ["Mozzarella", "Gorgonzola", "Queso de Cabra"] },
    { key: "carnes", type: "checkbox", items: ["Pollo", "Ternera", "Peperoni", "Atún"] },
    { key: "verduras", type: "checkbox", items: ["Cebolla", "Pimiento", "Champiñones", "Olivas Negras", "Piña"] }
];

const ProductModal = ({ isOpen, onClose, originalProduct, category, onScrollToSauces }) => {
    const { t, getTranslatedProduct } = useLanguage();

    // Internal State
    const [currentProduct, setCurrentProduct] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [selectedSauces, setSelectedSauces] = useState([]);
    const [isMenuUpgrade, setIsMenuUpgrade] = useState(false);
    const [hasDrink, setHasDrink] = useState(false);
    const [selectedLiquidBase, setSelectedLiquidBase] = useState(null);
    const [pizzaSelections, setPizzaSelections] = useState({});

    const isPizzaAtuGusto = currentProduct?.id === 106 || currentProduct?.name === "Pizza a tu Gusto";

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
            setPizzaSelections({});
        }
    }, [isOpen, originalProduct, getTranslatedProduct]);

    if (!isOpen || !currentProduct) return null;

    // Determina el precio de Solo Carne / Sin Lechuga según tipo de carne
    const soloCarnePrice = (() => {
        const n = (currentProduct?.name || '').toLowerCase();
        if (n.includes('ternera') || n.includes('mix')) return 3.50;
        return 2.50;
    })();

    // Helper to calculate total
    const calculateTotal = () => {
        const base = selectedVariant ? Number(selectedVariant.price) : Number(currentProduct.price || currentProduct.base_price || 0);
        const menuExtra = isMenuUpgrade ? 2.0 : 0;
        const drinkExtra = hasDrink ? 1.50 : 0;
        const sauceExtra = Math.max(0, selectedSauces.length - 2) * 0.25;
        const batidoExtra = (category?.name === "Batidos" && selectedLiquidBase === "Zumo de Naranja") ? 0.50 : 0;

        let pizzaExtra = 0;
        if (isPizzaAtuGusto) {
            let count = 0;
            Object.entries(pizzaSelections).forEach(([key, val]) => {
                if (key !== "bases" && Array.isArray(val)) {
                    count += val.length;
                }
            });
            if (count > 3) {
                pizzaExtra = (count - 3) * 1.00; // 1€ por ingrediente extra después de 3
            }
        }

        // Suplementos para Dürüm/Pita/Tacos/Burgers/Platos
        let extrasTotal = 0;
        let hasSoloCarneOrSinLechuga = false;

        if (pizzaSelections["extras"]) {
            pizzaSelections["extras"].forEach(extra => {
                const isCarneOrLechuga = extra.includes("Carne") || extra.includes("Lechuga");
                const match = extra.match(/\+([\d.]+)/);
                
                let price = 0;
                if (match) {
                    price = parseFloat(match[1]);
                } else {
                    // Fallback for hardcoded names if regex fails
                    if (isCarneOrLechuga) price = soloCarnePrice;
                    else if (extra.includes("Feta")) price = 1.00;
                    else if (extra.includes("Cabra")) price = 1.50;
                }

                // Evitar cobrar el suplemento de +2.00€ dos veces si se marcan ambos
                if (isCarneOrLechuga) {
                    if (!hasSoloCarneOrSinLechuga) {
                        extrasTotal += price;
                        hasSoloCarneOrSinLechuga = true;
                    }
                } else {
                    extrasTotal += price;
                }
            });
        }

        return (base + menuExtra + drinkExtra + sauceExtra + batidoExtra + pizzaExtra + extrasTotal).toFixed(2);
    };

    const SUPLEMENTOS_LIST = [
        { key: "extra_meat", price: soloCarnePrice },
        { key: "no_lettuce", price: soloCarnePrice },
        { key: "goat_cheese", price: 1.50 },
        { key: "feta_cheese", price: 1.00 },
        { key: "fried_egg", price: 1.00 },
        { key: "bacon", price: 1.00 },
        { key: "fries_inside", price: 1.00 },
        { key: "jalapenos", price: 0.50 },
        { key: "extra_cheddar", price: 0.50 }
    ];

    const needsSuplementos = ["Dürüm", "Pita", "Tacos", "Hamburguesas", "Platos", "Bocadillos", "Combo Box"].includes(category?.name) || 
                             currentProduct.name.toLowerCase().includes("taco") || 
                             currentProduct.name.toLowerCase().includes("burger");

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
                            {(originalProduct.alergenos || []).map(id => {
                                const alg = ALLERGEN_MAP[Number(id)];
                                if (!alg) return null;
                                return (
                                    <div key={id} className="allergen-info-item" title={t('allergen_' + id) || alg.name}>
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

                {/* CREA TU PIZZA (WEB) */}
                {isPizzaAtuGusto && (
                    <div className="selection-container">
                        <span className="section-title" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>
                            {t('pizza_custom.title')}
                        </span>
                        
                        {PIZZA_CUSTOM_GROUPS.map(group => (
                            <div key={group.key} style={{ marginBottom: '15px' }}>
                                <span className="section-title" style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '5px' }}>
                                    {t(`pizza_custom.${group.key}`).toUpperCase()}
                                </span>
                                <div className="selection-grid">
                                    {group.items.map(item => {
                                        const isSelected = group.type === "radio" 
                                            ? pizzaSelections[group.key] === item
                                            : (pizzaSelections[group.key] || []).includes(item);

                                        return (
                                            <button 
                                                key={item} 
                                                className={`option-btn ${isSelected ? 'selected' : ''}`}
                                                style={isSelected ? { background: 'var(--primary)', color: 'white' } : {}}
                                                onClick={() => {
                                                    const current = pizzaSelections[group.key];
                                                    if (group.type === "radio") {
                                                        setPizzaSelections({ ...pizzaSelections, [group.key]: item });
                                                    } else {
                                                        const list = current || [];
                                                        if (list.includes(item)) {
                                                            setPizzaSelections({ ...pizzaSelections, [group.key]: list.filter(i => i !== item) });
                                                        } else {
                                                            setPizzaSelections({ ...pizzaSelections, [group.key]: [...list, item] });
                                                        }
                                                    }
                                                }}
                                            >
                                                {t(`pizza_custom.items.${item}`) || item}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
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

                {/* Suplementos (Dürüm / Pita / Tacos / Burgers / Platos) */}
                {needsSuplementos && (
                    <div className="selection-container" style={{ border: '1px solid rgba(242, 97, 34, 0.2)', padding: '10px', borderRadius: '12px' }}>
                        <span className="section-title" style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                             {t('supplements_label') || 'SUPLEMENTOS Y EXTRAS'}
                        </span>
                        <div className="selection-grid">
                            {SUPLEMENTOS_LIST.map(extra => {
                                const list = pizzaSelections["extras"] || [];
                                const isSelected = list.some(e => e.includes(extra.key));
                                return (
                                    <button 
                                        key={extra.key} 
                                        className={`option-btn ${isSelected ? 'selected' : ''}`}
                                        onClick={() => {
                                            const entry = `${t(extra.key)} (+${extra.price}€) [ID:${extra.key}]`;
                                            if (isSelected) {
                                                setPizzaSelections({ ...pizzaSelections, extras: list.filter(e => !e.includes(extra.key)) });
                                            } else {
                                                setPizzaSelections({ ...pizzaSelections, extras: [...list, entry] });
                                            }
                                        }}
                                    >
                                        {t(extra.key)} <span style={{ fontSize: '0.85em', opacity: 0.9 }}>(+<PriceDisplay price={extra.price} />)</span>
                                    </button>
                                );
                            })}
                        </div>
                        {category?.name === "Dürüm" && (
                            <p style={{ fontSize: "0.75rem", opacity: 0.7, fontStyle: "italic", marginTop: "8px", borderTop: '1px solid #eee', paddingTop: '5px' }}>
                                * {t('durum_no_lettuce_warning') || 'Si no se pone lechuga se aplicará suplemento de Solo Carne.'}
                            </p>
                        )}
                    </div>
                )}

                {/* Redirect to Sauces Logic */}
                {(((category?.name || "").includes("Tacos")) || ((category?.name || "").includes("Bocadillos")) || ((category?.name || "").includes("Hamburguesas")) || (category?.name || "") === "Dürüm" || (category?.name || "") === "Pita" || (category?.name || "") === "Combo Box" || (originalProduct?.name || "").toLowerCase().includes("taco") || (originalProduct?.name || "").toLowerCase().includes("burger")) && (
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
