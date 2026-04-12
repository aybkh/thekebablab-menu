import { useTenant } from '../../context/TenantContext';
import { useLanguage } from '../../context/LanguageContext';

// Función exclusiva para forzar la app de Glovo según el sistema operativo
const handleGlovoRedirect = (webUrl, e) => {
    e.preventDefault(); 
    
    const isAndroid = /android/i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    // Limpiamos la URL para inyectarla en los comandos del móvil
    const cleanUrl = webUrl.replace('https://', '').replace('http://', '');

    if (isAndroid) {
        // Android: Usa el sistema nativo Intent para abrir la app o ir a Play Store
        window.location.href = `intent://${cleanUrl}#Intent;package=com.glovo;scheme=https;end;`;
    } 
    else if (isIOS) {
        // iPhone: Intenta abrir la app de Glovo, si falla en 2.5s manda a la App Store
        window.location.href = `glovoapp://${cleanUrl}`;
        setTimeout(() => {
            window.location.href = "https://apps.apple.com/es/app/glovo-comida-y-mucho-m%C3%A1s/id951812684";
        }, 2500);
    } 
    else {
        // Ordenador (PC/Mac): Abre la web normal
        window.open(webUrl, '_blank');
    }
};

const DeliverySection = () => {
    const { theme } = useTenant();
    const { t } = useLanguage();

    if (!theme) return null;

    // UBER EATS: URL exacta para que abra en navegador
    const uberEatsLink = theme.socials.uberEats || "https://www.ubereats.com/store-browse-uuid/397ee274-d08d-4823-b6db-91a7533f679b?diningMode=DELIVERY";
    
    // GLOVO: Pon tu URL web limpia aquí (quitando el link de Adjust) para que el código la pueda leer
    const glovoLink = theme.socials.glovo || "https://glovoapp.com/es/es/TU_CIUDAD/the-kebab-lab/";

    return (
        <section id="delivery" className="delivery-section">
            <div className="max-w-[1200px] mx-auto">
                <div className="section-head mb-12">
                    <h2>{t('delivery_title')}</h2>
                </div>

                <div className="delivery-container">
                    <a 
                        href={glovoLink} 
                        onClick={(e) => handleGlovoRedirect(glovoLink, e)} 
                        className="delivery-card glovo"
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="delivery-logo-wrapper">
                            <img src="/images/glovo.webp" alt="Glovo" className="delivery-brand-logo" />
                        </div>
                        <div className="delivery-text-info">
                            <span className="delivery-btn-text">{t('order_glovo')}</span>
                            <span className="delivery-note">{t('glovo_note')}</span>
                        </div>
                        <div className="delivery-arrow">➔</div>
                    </a>

                    <a 
                        href={uberEatsLink} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="delivery-card uber-eats"
                    >
                        <div className="delivery-logo-wrapper">
                            <img src="/images/ubereats.webp" alt="Uber Eats" className="delivery-brand-logo" />
                        </div>
                        <div className="delivery-text-info">
                            <span className="delivery-btn-text">{t('order_ubereats')}</span>
                            <span className="delivery-note">{t('ubereats_note')}</span>
                        </div>
                        <div className="delivery-arrow">➔</div>
                    </a>

                    {/* PHONE / LOCAL ORDER: Botón para llamar directamente */}
                    <a 
                        href={`tel:972947025`} 
                        className="delivery-card local"
                    >
                        <div className="delivery-logo-wrapper">
                            <img src="/images/kebab-ico.webp" alt="The Kebab Lab" className="delivery-brand-logo" />
                        </div>
                        <div className="delivery-text-info">
                            <span className="delivery-btn-text">{t('local_order_label')}</span>
                            <span className="delivery-note">{t('delivery_fee_note')}</span>
                        </div>
                        <div className="delivery-arrow">➔</div>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default DeliverySection;