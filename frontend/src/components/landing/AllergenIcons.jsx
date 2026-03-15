import React, { useState } from 'react';

// --- TRADUCTOR HÍBRIDO (SVG + Fallback Emoji) ---
const ALLERGEN_MAP = {
    1: { name: "Gluten", iconSrc: "/icons/allergens/gluten.svg", emoji: "🌾", color: "#e67e22" },
    2: { name: "Crustáceos", iconSrc: "/icons/allergens/crustaceos.svg", emoji: "🦐", color: "#e74c3c" },
    3: { name: "Huevos", iconSrc: "/icons/allergens/huevos.svg", emoji: "🥚", color: "#f1c40f" },
    4: { name: "Pescado", iconSrc: "/icons/allergens/pescado.svg", emoji: "🐟", color: "#3498db" },
    5: { name: "Cacahuetes", iconSrc: "/icons/allergens/cacahuetes.svg", emoji: "🥜", color: "#d35400" },
    6: { name: "Soja", iconSrc: "/icons/allergens/soja.svg", emoji: "🫘", color: "#27ae60" },
    7: { name: "Lácteos", iconSrc: "/icons/allergens/lacteos.svg", emoji: "🥛", color: "#bdc3c7" },
    8: { name: "Frutos de cáscara", iconSrc: "/icons/allergens/frutos-cascara.svg", emoji: "🌰", color: "#d35400" },
    9: { name: "Apio", iconSrc: "/icons/allergens/apio.svg", emoji: "🥬", color: "#2ecc71" },
    10: { name: "Mostaza", iconSrc: "/icons/allergens/mostaza.svg", emoji: "🧴", color: "#f39c12" },
    11: { name: "Sésamo", iconSrc: "/icons/allergens/sesamo.svg", emoji: "🥯", color: "#ecf0f1" },
    12: { name: "Sulfitos", iconSrc: "/icons/allergens/sulfitos.svg", emoji: "🧪", color: "#9b59b6" },
    13: { name: "Moluscos", iconSrc: "/icons/allergens/moluscos.svg", emoji: "🐚", color: "#34495e" },
    14: { name: "Altramuces", iconSrc: "/icons/allergens/altramuces.svg", emoji: "🌸", color: "#f1c40f" },
    15: { name: "Picante", iconSrc: "/icons/allergens/picante.svg", emoji: "🌶️", color: "#c0392b" },
    16: { name: "Carne", iconSrc: "/icons/allergens/carne.svg", emoji: "🥩", color: "#7f8c8d" }
};

// Sub-componente inteligente que maneja su propio error de imagen
const AllergenIconItem = ({ alg }) => {
    const [imageError, setImageError] = useState(false);

    if (imageError) {
        // FALLBACK: Mostrar el Emoji si no hay SVG
        return (
            <div title={alg.name} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '28px', height: '28px', borderRadius: '50%',
                background: 'white', border: `2px solid ${alg.color}`,
                fontSize: '1.2rem', boxShadow: '0 2px 5px rgba(0,0,0,0.3)', cursor: 'help'
            }}>
                <span role="img" aria-label={alg.name}>{alg.emoji}</span>
            </div>
        );
    }

    // NORMAL: Mostrar la imagen SVG
    return (
        <img 
            src={alg.iconSrc}
            alt={alg.name}
            title={alg.name}
            onError={() => setImageError(true)} // Si falla, activa el fallback
            style={{
                width: '28px', height: '28px', objectFit: 'contain',
                filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.4))', cursor: 'help'
            }}
        />
    );
};

const AllergenIcons = ({ allergenIds }) => {
    if (!allergenIds || allergenIds.length === 0) return null;

    const validAllergens = allergenIds
        .map(id => ALLERGEN_MAP[id])
        .filter(alg => alg !== undefined);

    if (validAllergens.length === 0) return null;

    return (
        <div 
            className="allergen-overlay" // Clase para que el agente la posicione con CSS
            style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px',
                padding: '5px'
            }}
        >
            {validAllergens.map((alg, index) => (
                <AllergenIconItem key={index} alg={alg} />
            ))}
        </div>
    );
};

export default AllergenIcons;