import React from 'react';
import { Star, User } from 'lucide-react';

// Real Data extracted from public/resenas_kebab.csv
const reviews = [
    { name: "Ariadna Pinazo", text: "Tomamos un combo de 2 durums con patatas y añadimos unos fingers de mozzarella. Todo estaba realmente rico, en especial el durum, que era super completo. Las patatas y los fingers llevaban un aderezo que las elevaba por completo.", stars: 5 },
    { name: "Alanis Alba Gómez", text: "Hemos ido toda la familia a comer, un sitio maravilloso... La comida INCREÍBLE, para el precio que es tan barato te ponen una cantidad muy considerada!!!", stars: 5 },
    { name: "Shyziii Mughal", text: "Acabamos de descubrir este kebab nuevo en Blanes y ¡madre mía! 😍 El sitio es precioso, súper moderno y limpio. Los chicos que atienden son un encanto... La comida buenísima.", stars: 5 },
    { name: "Furkan Ak", text: "I’m from Germany and had a Dürüm here — and I have to say, this is the only place in Spain I’ve found that truly meets German standards! 🌯🇩🇪", stars: 5 },
    { name: "Elena Salawi", text: "Un lugar agradable y fresco. El camarero es muy amable y atento. La comida es económica y muy buena. Comí un menú taco mixto (pollo y ternera) y me gustó mucho, llena muchísimo.", stars: 5 },
    { name: "Adele Gottschefsky", text: "One of the best kebabs I've ever eaten in my life. We ate a Dürüm and it was amazing. It should be noted that the place is really clean, the Kebab extremely well done. Congratulations!!!", stars: 5 },
    { name: "Taiba Ilyas", text: "¡Me ha encantado! Hacía mucho tiempo que no comía un taco tan jugoso y que me lo haya acabado entero. La pizza estaba muy buena y tenía un sabor suave y muy apetecible. El lugar es muy tranquilo.", stars: 5 },
    { name: "Yani Gospodinova", text: "Pedí un menú de kebab y la porción es muy generosa. El sitio es muy limpio, muy buen servicio y una atención muy amable.", stars: 5 },
    { name: "Daniel C.", text: "Brutal, muy bueno todo y todo de buena calidad, ¡volveremos!", stars: 5 },
    { name: "ZEBALLOS SERRUDO MAJHERLY", text: "Nos encantó la comida, pedimos unas alitas, una pita y un taco 🤩 No tuvimos que esperar mucho y todo nos llegó excelente, la atención muy buena.", stars: 5 },
    { name: "Meri Bahri", text: "Ayer entré a este local con mis hijos a comer y fue todo un acierto, local bonito con bastante espacio, ¡muy buen trato desde el principio de todos los trabajadores!", stars: 5 },
    { name: "Claudia Alba", text: "¡El mango lassi estaba riquísimo! El taco súper jugoso y la carne muy suave, la pizza 4 quesos increíble y todo 100% halal. Los camareros y cocineros muy amables y simpáticos, sitio muy recomendado.", stars: 5 },
    { name: "Jakub Michálek", text: "Un gran kebab a un gran precio. Los precios son excelentes, las raciones son grandes y muy sabrosas. Recomiendo visitarlo.", stars: 5 },
    { name: "Nihal Brikci", text: "¡Una experiencia magnífica! Paramos en Blanes especialmente para descubrir este restaurante, y no nos decepcionó... la pizza es excelente, los tacos también.", stars: 5 },
    { name: "haizea Atxaga Abad", text: "Nunca pongo reseñas porque prefiero guardármelo para mí, pero este lugar ha sido espectacular. Los precios de menú rondan los 7 euros y las porciones son muy buenas. Las patatas fritas están BUENÍSIMAS...", stars: 5 }
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
                                <Star key={i} size={14} fill={i < review.stars ? "#F1C40F" : "#e0e0e0"} color={i < review.stars ? "#F1C40F" : "#e0e0e0"} />
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
