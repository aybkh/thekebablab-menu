import React from 'react';
import { ChefHat } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import PriceDisplay from '../shared/PriceDisplay';
import AllergenIcons from '../landing/AllergenIcons';
import '../../styles/pos/ProductCard.css';

const ProductCard = ({ originalProd, category, onClick }) => {
    const { getTranslatedProduct, t } = useLanguage();
    const [imgError, setImgError] = React.useState(false);

    if (!originalProd) return null;
    const prod = getTranslatedProduct(originalProd);

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
                {!imgError ? (
                    <img
                        src={originalProd.image ? `/products/${originalProd.image.replace('.jpg', '.webp').replace('.png', '.webp')}` : getFallbackSrc()}
                        alt={originalProd.name}
                        className="product-image"
                        onError={(e) => {
                            const simpleSrc = `/products/${(originalProd.name || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ /g, '-').replace(/[^a-z0-9-]/g, '')}.webp`;
                            if (!e.target.src.includes(simpleSrc) && !originalProd.image) {
                                e.target.src = simpleSrc;
                            } else {
                                setImgError(true);
                            }
                        }}
                    />
                ) : (
                    <div className="product-fallback-icon">
                        <ChefHat size={48} />
                    </div>
                )}
            </div>
        );
    };

    return (
        <div
            className={`product-card ${prod.isAvailable === false ? 'sold-out' : ''}`}
            onClick={() => { if (prod.isAvailable !== false) onClick(); }}>
            
            {prod.isAvailable === false && (
                <div className="sold-out-badge">
                    {t('sold_out')}
                </div>
            )}

            {renderProductImage()}

            {originalProd.alergenos && originalProd.alergenos.length > 0 && (
                <div className="product-allergens-strip">
                    <AllergenIcons allergenIds={originalProd.alergenos} />
                </div>
            )}

            <div className="product-info">
                <h3 className="product-name">{prod.name}</h3>
                <div className="product-price">
                    <PriceDisplay 
                        price={(prod.variants || []).length > 0
                            ? Math.min(...prod.variants.map(v => v.price))
                            : (prod.price || prod.base_price || 0)} 
                    />
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
