import React from 'react';
import { Star, User } from 'lucide-react';

// Real Data extracted from public/resenas_kebab.csv
const reviews = [
    { name: "Marw F.T", text: "Gente especializada en lo suyo, nadie los iguala en la zona. Gente trabajadora y 10/10.", stars: 5 },
    { name: "Suli Harrak", text: "The Kebab Lab es un sitio increíble. Comida espectacular y precios razonables. ¡Querrás volver!", stars: 5 },
    { name: "Mayte Brascó", text: "Local limpio y acogedor. El mejor taco que he probado en la provincia de Barcelona: jugoso y muy sabroso.", stars: 5 },
    { name: "Patricia Martínez", text: "Desde que lo hemos descubierto, pedimos muy a menudo. Trato excelente. La comida es otro nivel.", stars: 5 },
    { name: "Ss Mn", text: "¡Los mejores Tacos que he probado! Calidad, limpieza y servicio de 10.", stars: 5 },
    { name: "Raul", text: "Trato excelente y super amables. No me canso de comer allí, todo super bueno y limpio.", stars: 5 },
    { name: "Mohamed Jebari", text: "Sin duda los mejores tacos de Mataró.", stars: 5 },
    { name: "Aiman KR", text: "Comida de calidad, muy buen servicio y atención.", stars: 5 },
    { name: "Chera Z", text: "Lugar muy limpio. La comida muy buena.", stars: 5 },
    { name: "Nil Manrique", text: "Els millors tacos de Mataró.", stars: 5 }
];

const GoogleIcon = ({ style = {} }) => (
    <svg style={style} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

const ReviewsSection = () => {
    return (
        <section className="reviews-section relative">
            <div className="section-head">
                <h2>LO QUE DICEN DE NOSOTROS</h2>
                <div style={{ fontSize: '1rem', color: '#ccc', marginTop: '10px', fontFamily: "'Montserrat', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <GoogleIcon /> 4.6⭐ en Google Maps
                </div>
            </div>

            {/* Marquee Container */}
            <div className="marquee-container">
                {/* Duplicate reviews array to create seamless loop */}
                {[...reviews, ...reviews].map((review, idx) => (
                    <div key={idx} className="review-card hover:scale-105 transition-transform duration-300 relative">
                        {/* Absolute Google Icon in Card */}
                        <GoogleIcon style={{ position: 'absolute', top: '20px', right: '20px', width: '24px', height: '24px' }} />

                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 uppercase">
                                <User size={18} />
                            </div>
                            <div>
                                <span className="font-bold text-sm block text-black truncate w-40">{review.name}</span>
                            </div>
                        </div>
                        <div className="flex gap-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={14} fill={i < review.stars ? "var(--primary)" : "#e0e0e0"} color={i < review.stars ? "var(--primary)" : "#e0e0e0"} />
                            ))}
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">
                            "{review.text}"
                        </p>
                    </div>
                ))}
            </div>

            <style>{`
                .marquee-container:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </section>
    );
};

export default ReviewsSection;
