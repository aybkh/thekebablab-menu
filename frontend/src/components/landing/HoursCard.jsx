import React, { useState, useEffect } from 'react';

const schedule = [
    { name: 'Lunes', open: 12, close: 23, label: '12:00 - 23:00' },
    { name: 'Martes', open: 12, close: 23, label: '12:00 - 23:00' },
    { name: 'Miércoles', open: 12, close: 23, label: '12:00 - 23:00' },
    { name: 'Jueves', open: 12, close: 23, label: '12:00 - 23:00' },
    { name: 'Viernes', open: 12, close: 23, label: '12:00 - 23:00' },
    { name: 'Sábado', open: 12, close: 23, label: '12:00 - 23:00' },
    { name: 'Domingo', open: 12, close: 23, label: '12:00 - 23:00' },
];

const HoursCard = () => {
    const [status, setStatus] = useState({ isOpen: false, text: 'Cargando', color: '#666' });
    const todayIndex = (new Date().getDay() + 6) % 7;

    useEffect(() => {
        const checkStatus = () => {
            const now = new Date();
            const hour = now.getHours() + (now.getMinutes() / 60);
            const today = schedule[todayIndex];

            if (today.closed) {
                setStatus({ isOpen: false, text: 'CERRADO HOY', color: '#E74C3C' });
            } else {
                if (hour >= today.open && hour < today.close) {
                    setStatus({ isOpen: true, text: 'ABIERTO AHORA', color: '#2ECC71' });
                } else if (hour < today.open) {
                    setStatus({ isOpen: false, text: `ABRE A LAS ${today.open}:00`, color: '#F1C40F' });
                } else {
                    setStatus({ isOpen: false, text: 'CERRADO', color: '#E74C3C' });
                }
            }
        };
        checkStatus();
        const interval = setInterval(checkStatus, 60000);
        return () => clearInterval(interval);
    }, [todayIndex]);

    return (
        <div style={{ width: '100%', maxWidth: '100%', margin: '0 auto' }}>

            <div style={{
                background: '#142818',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                padding: '25px',
                position: 'relative',
                overflow: 'hidden'
            }}>

                {/* Status Indicator (Inside Card, Top) */}
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 15px', borderRadius: '50px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: status.color, boxShadow: `0 0 8px ${status.color}` }}></span>
                        <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#ccc', letterSpacing: '1px', textTransform: 'uppercase' }}>{status.text}</span>
                    </div>
                </div>

                {/* Grid Rows */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {schedule.map((day, idx) => {
                        const isToday = idx === todayIndex;

                        let rowStyle = {
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 15px', borderRadius: '8px',
                            transition: 'all 0.3s', border: '1px solid transparent'
                        };
                        let nameStyle = { fontFamily: "'Montserrat', sans-serif", fontWeight: '500', textTransform: 'uppercase', fontSize: '0.9rem', color: '#999' };
                        let timeStyle = { fontFamily: 'monospace', fontSize: '0.9rem', color: '#777' };

                        if (day.closed) {
                            rowStyle.background = 'rgba(231, 76, 60, 0.08)';
                            rowStyle.border = '1px solid rgba(231, 76, 60, 0.2)';
                            nameStyle.color = '#e57373';
                            timeStyle.color = '#e57373';
                            timeStyle.fontWeight = 'bold';
                        } else if (isToday) {
                            rowStyle.background = 'rgba(46, 204, 113, 0.15)';
                            rowStyle.border = '1px solid #2ecc71';
                            rowStyle.transform = 'scale(1.02)';
                            rowStyle.boxShadow = '0 4px 15px rgba(46, 204, 113, 0.15)';
                            nameStyle.color = 'white';
                            nameStyle.fontWeight = 'bold';
                            timeStyle.color = '#2ecc71';
                            timeStyle.fontWeight = 'bold';
                        } else {
                            rowStyle.borderBottom = 'none'; // Clean look
                        }

                        return (
                            <div key={day.name} style={rowStyle}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    {isToday && <span style={{ color: '#2ecc71', fontSize: '10px' }}>●</span>}
                                    <span style={nameStyle}>{day.name}</span>
                                </div>
                                <span style={timeStyle}>
                                    {day.closed ? 'CERRADO' : day.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default HoursCard;
