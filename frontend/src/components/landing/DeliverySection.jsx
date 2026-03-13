import React from 'react';
import { useTenant } from '../../context/TenantContext';

const DeliverySection = () => {
    const { theme } = useTenant();

    if (!theme) return null;

    // Force showing both buttons as requested, even if links are currently empty
    const uberEatsLink = theme.socials.uberEats || "#";
    const glovoLink = theme.socials.glovo || "#";

    return (
        <section id="delivery" className="delivery-section">
            <div className="max-w-[1200px] mx-auto">
                <div className="section-head mb-12">
                    <h2>PEDIR A DOMICILIO</h2>
                </div>

                <div className="delivery-container">
                    <a href={glovoLink} target="_blank" rel="noreferrer" className="delivery-card glovo">
                        <div className="delivery-logo-wrapper">
                            <img src="/images/glovo.webp" alt="Glovo" className="delivery-brand-logo" />
                        </div>
                        <span className="delivery-btn-text">{theme.socials.glovoLabel || 'PIDE EN GLOVO'}</span>
                        <div className="delivery-arrow">➔</div>
                    </a>

                    <a href={uberEatsLink} target="_blank" rel="noreferrer" className="delivery-card uber-eats">
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
