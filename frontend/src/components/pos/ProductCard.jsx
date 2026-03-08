import React from 'react';
import { ChefHat } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const ProductCard = ({ originalProd, category, onClick }) => {
    const { getTranslatedProduct, t } = useLanguage();

    if (!originalProd) return null;
    const prod = getTranslatedProduct(originalProd);

    // Reuse the image logic from original POSPage
    const renderProductImage = () => {
        const getFallbackSrc = () => {
            let cleanProd = (originalProd.name || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
            let suffix = "";
            const catName = category.name || "";
            if (catName.includes("Tacos")) suffix = "-taco";
            else if (catName.includes("Pizzas")) suffix = "-pizza";
            else if (catName.includes("Bocadillos")) suffix = "-bocata";
            else if (catName.includes("Hamburguesas")) { suffix = "-burger"; cleanProd = cleanProd.replace("hamburguesa-", ""); }
            else if (catName.includes("Tajins")) suffix = "-tajin";
            else if (catName.includes("Platos")) { suffix = "-plato"; cleanProd = cleanProd.replace("plato-de-", "").replace("plato-", ""); }
            else if (catName.includes("Batidos")) { suffix = "-batido"; cleanProd = cleanProd.replace("batido-de-", "").replace("batido-", ""); }
            else if (catName.includes("Postres")) suffix = "-postre";
            else if (catName.includes("Café")) { suffix = "-cafe"; cleanProd = cleanProd.replace("cafe-", ""); }
            else if (catName.includes("Ensaladas")) {
                if (cleanProd.includes("wrap")) { suffix = "-wrap"; cleanProd = cleanProd.replace("wrap-de-", "").replace("wrap-", ""); }
                else { suffix = "-ensalada"; cleanProd = cleanProd.replace("ensalada-", ""); }
            }
            return `/products/${cleanProd}${suffix}.webp`;
        };

        return (
            <div className="product-image-container">
                <img
                    src={originalProd.image ? `/products/${originalProd.image.replace('.jpg', '.webp').replace('.png', '.webp')}` : getFallbackSrc()}
                    alt={originalProd.name}
                    className="product-image"
                    onError={(e) => {
                        const simpleSrc = `/products/${(originalProd.name || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ /g, '-').replace(/[^a-z0-9-]/g, '')}.webp`;
                        if (!e.target.src.includes(simpleSrc) && !originalProd.image) {
                            e.target.src = simpleSrc;
                        } else {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                        }
                    }}
                />
                <div style={{ width: '100%', height: '100%', display: 'none', alignItems: 'center', justifyContent: 'center', background: '#f0f0f0', color: '#ccc' }}>
                    <ChefHat size={48} />
                </div>
            </div>
        );
    };

    return (
        <div
            className="product-card"
            onClick={() => { if (prod.isAvailable !== false) onClick(); }}
            style={{
                display: 'flex', flexDirection: 'column', height: '100%',
                filter: prod.isAvailable === false ? 'grayscale(100%) opacity(60%)' : 'none',
                cursor: prod.isAvailable === false ? 'not-allowed' : 'pointer',
                pointerEvents: prod.isAvailable === false ? 'none' : 'auto',
                position: 'relative'
            }}>
            {prod.isAvailable === false && (
                <div style={{ position: 'absolute', top: '10px', right: '10px', background: '#e74c3c', color: 'white', padding: '5px 10px', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.8rem', zIndex: 10 }}>
                    {t('sold_out')}
                </div>
            )}

            {renderProductImage()}

            <div className="product-info" style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <h3 className="product-name" style={{
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                    overflow: 'hidden', textOverflow: 'ellipsis', minHeight: '2.8rem',
                    wordBreak: 'break-word', overflowWrap: 'break-word', hyphens: 'auto',
                    fontSize: '0.85rem', lineHeight: '1.2'
                }}>{prod.name}</h3>
                <div className="product-price" style={{ marginTop: 'auto' }}>
                    {(prod.variants || []).length > 0
                        ? `${Math.min(...prod.variants.map(v => v.price))}€`
                        : `${(prod.price || prod.base_price || 0).toFixed(2)}€`}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
