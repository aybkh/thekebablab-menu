import React from 'react';
import { useTenant } from '../../context/TenantContext';

const DeliverySection = () => {
    const { theme } = useTenant();

    if (!theme) return null;

    // Enlaces directos y limpios (usando tus IDs y Smart Links)
    const uberEatsLink = theme.socials.uberEats || "https://www.ubereats.com/store-browse-uuid/397ee274-d08d-4823-b6db-91a7533f679b?diningMode=DELIVERY";
    const glovoLink = theme.socials.glovo || "https://glovo.go.link/open?adjust_deeplink=glovoapp%3A%2F%2Fopen%3Flink_type%3Dstore%26store_id%3D518143&adjust_t=s321jkn";

    return (
        <section id="delivery" className="delivery-section">
            <div className="max-w-[1200px] mx-auto">
                <div className="section-head mb-12">
                    <h2>PEDIR A DOMICILIO</h2>
                </div>

                <div className="delivery-container">
                    {/* Enlace estándar: Deja que el navegador decida qué es mejor */}
                    <a href={glovoLink} target="_blank" rel="noopener noreferrer" className="delivery-card glovo">
                        <div className="delivery-logo-wrapper">
                            <img src="/images/glovo.webp" alt="Glovo" className="delivery-brand-logo" />
                        </div>
                        <span className="delivery-btn-text">{theme.socials.glovoLabel || 'PIDE EN GLOVO'}</span>
                        <div className="delivery-arrow">➔</div>
                    </a>

                    <a href={uberEatsLink} target="_blank" rel="noopener noreferrer" className="delivery-card uber-eats">
                        <div className="delivery-logo-wrapper">
                            <img src="/images/ubereats.webp" alt="Uber Eats" className="delivery-brand-logo" />
                        </div>
                        <span className="delivery-btn-text">{theme.socials.uberEatsLabel || 'PIDE EN UBER EATS'}</span>
                        <div className="delivery-arrow">➔</div>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default DeliverySection;