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
                setStatus({ isOpen: false, text: 'CERRADO HOY', color: '#a41000ff' });
            } else {
                if (hour >= today.open && hour < today.close) {
                    setStatus({ isOpen: true, text: 'ABIERTO AHORA', color: '#d87a22ff' });
                } else if (hour < today.open) {
                    setStatus({ isOpen: false, text: `ABRE A LAS ${today.open}:00`, color: '#f1800fff' });
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
        <div className="hours-container">
            <div className="hours-card">
                {/* Status Indicator (Inside Card, Top) */}
                <div className="hours-status-box">
                    <div className="hours-status-badge">
                        <span className="hours-status-dot" style={{ background: status.color, boxShadow: `0 0 8px ${status.color}` }}></span>
                        <span className="hours-status-text">{status.text}</span>
                    </div>
                </div>

                {/* Grid Rows */}
                <div className="hours-grid">
                    {schedule.map((day, idx) => {
                        const isToday = idx === todayIndex;
                        const isClosed = day.closed;

                        return (
                            <div key={day.name} className={`hours-row ${isToday ? 'today' : ''} ${isClosed ? 'closed' : ''}`}>
                                <div className="flex items-center gap-2">
                                    {isToday && <span className="today-dot">●</span>}
                                    <span className="day-name">{day.name}</span>
                                </div>
                                <span className="day-time">
                                    {isClosed ? 'CERRADO' : day.label}
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
