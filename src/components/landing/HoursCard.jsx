import React, { useState, useEffect } from 'react';
import { useSiteConfig } from '../../context/SiteConfigContext';
import { useLanguage } from '../../context/LanguageContext';

const HoursCard = () => {
    const { siteConfig } = useSiteConfig();
    const { t } = useLanguage();
    const schedule = siteConfig?.schedule || [];
    const [status, setStatus] = useState({ isOpen: false, text: t('hours_loading'), color: '#666' });
    const todayIndex = (new Date().getDay() + 6) % 7;

    useEffect(() => {
        if (schedule.length === 0) return;
        const checkStatus = () => {
            const now = new Date();
            const hour = now.getHours() + (now.getMinutes() / 60);
            const today = schedule[todayIndex];

            if (today.closed) {
                setStatus({ isOpen: false, text: t('closed_today'), color: '#a41000ff' });
            } else {
                if (hour >= today.open && hour < today.close) {
                    setStatus({ isOpen: true, text: t('open_now'), color: '#d87a22ff' });
                } else if (hour < today.open) {
                    setStatus({ isOpen: false, text: `${t('opens_at')} ${today.open}:00`, color: '#f1800fff' });
                } else {
                    setStatus({ isOpen: false, text: t('closed'), color: '#E74C3C' });
                }
            }
        };
        checkStatus();
        const interval = setInterval(checkStatus, 60000);
        return () => clearInterval(interval);
    }, [todayIndex, schedule]);

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
                                    <span className="day-name">{t(`day_${idx}`)}</span>
                                </div>
                                <span className="day-time">
                                    {isClosed ? t('closed') : day.label}
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
