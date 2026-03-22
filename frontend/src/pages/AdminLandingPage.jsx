import React, { useState } from 'react';
import { useSiteConfig } from '../context/SiteConfigContext';
import { useTenant } from '../context/TenantContext';
import { Save, Download, Plus, Trash2, Video, Image, Star, Clock, Palette, Info } from 'lucide-react';
import '../styles/AdminLandingPage.css';

const AdminLandingPage = () => {
    const { siteConfig, setSiteConfig, isLoading: configLoading } = useSiteConfig();
    const { theme } = useTenant();
    const [activeTab, setActiveTab] = useState('general');
    const [localConfig, setLocalConfig] = useState(siteConfig);
    const [isAuthed, setIsAuthed] = useState(false);
    const [password, setPassword] = useState('');

    // Ensure state sync on load
    React.useEffect(() => {
        if (siteConfig && !localConfig) {
            setLocalConfig(siteConfig);
        }
    }, [siteConfig, localConfig]);

    if (configLoading || !localConfig) return <div className="admin-landing-container">Cargando config...</div>;

    // --- Auth Handler ---
    const handleLogin = (e) => {
        e.preventDefault();
        // Simple hardcoded password for quick standalone frontend config
        if (password === 'admin123') {
            setIsAuthed(true);
        } else {
            alert('Password incorrecto');
        }
    };

    if (!isAuthed) {
        return (
            <div className="admin-landing-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
                <form onSubmit={handleLogin} style={{ background: '#1e293b', padding: '2rem', borderRadius: '0.75rem', width: '300px', textAlign: 'center' }}>
                    <h2 style={{ marginBottom: '1.5rem', color: '#38bdf8' }}>Acceso Admin Landing</h2>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        placeholder="Ingresa password"
                        style={{ padding: '0.75rem', width: '100%', marginBottom: '1rem', background: '#0f172a', color: 'white', border: '1px solid #334155', borderRadius: '0.375rem', boxSizing: 'border-box' }}
                    />
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Entrar</button>
                </form>
            </div>
        );
    }

    // --- Save and Export Handlers ---
    const saveToMemory = () => {
        setSiteConfig(localConfig);
        alert('Cambios guardados en memoria (Refrescar perderá los cambios)');
    };

    const downloadJson = (data, filename) => {
        const jsonString = JSON.stringify(data, null, 4);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
    };

    const handleExportConfig = () => {
        downloadJson(localConfig, 'site_config.json');
    };

    // --- Sub-form Change Handlers ---
    const handleArrayChange = (field, index, subfield, value) => {
        const updated = [...localConfig[field]];
        updated[index] = { ...updated[index], [subfield]: value };
        setLocalConfig({ ...localConfig, [field]: updated });
    };

    const handleAddItem = (field, defaultObj) => {
        setLocalConfig({
            ...localConfig,
            [field]: [...localConfig[field], defaultObj]
        });
    };

    const handleRemoveItem = (field, index) => {
        const updated = localConfig[field].filter((_, i) => i !== index);
        setLocalConfig({ ...localConfig, [field]: updated });
    };

    const handleNestedChange = (field, index, nestedField, listIndex, value) => {
        const updatedConfig = { ...localConfig };
        const updatedList = [...updatedConfig[field]];
        const updatedNestedList = [...updatedList[index][nestedField]];
        updatedNestedList[listIndex] = { ...updatedNestedList[listIndex], ...value };
        updatedList[index][nestedField] = updatedNestedList;
        setLocalConfig({ ...updatedConfig, [field]: updatedList });
    };

    const handleAddNestedItem = (field, index, nestedField, defaultObj) => {
        const updatedConfig = { ...localConfig };
        const updatedList = [...updatedConfig[field]];
        updatedList[index][nestedField] = [...updatedList[index][nestedField], defaultObj];
        setLocalConfig({ ...updatedConfig, [field]: updatedList });
    };

    const handleRemoveNestedItem = (field, index, nestedField, listIndex) => {
        const updatedConfig = { ...localConfig };
        const updatedList = [...updatedConfig[field]];
        updatedList[index][nestedField] = updatedList[index][nestedField].filter((_, i) => i !== listIndex);
        setLocalConfig({ ...updatedConfig, [field]: updatedList });
    };

    return (
        <div className="admin-landing-container">
            <header className="admin-header">
                <h1>Panel Landing Page</h1>
                <div className="admin-actions">
                    <button className="btn btn-secondary" onClick={saveToMemory}><Save size={16} /> Guardar Memoria</button>
                    <button className="btn btn-primary" onClick={handleExportConfig}><Download size={16} /> Exportar `site_config.json`</button>
                </div>
            </header>

            <div className="admin-body">
                <nav className="admin-sidebar">
                    <button className={`tab-btn ${activeTab === 'hero' ? 'active' : ''}`} onClick={() => setActiveTab('hero')}><Video size={16} /> Hero Media</button>
                    <button className={`tab-btn ${activeTab === 'social' ? 'active' : ''}`} onClick={() => setActiveTab('social')}><Video size={16} /> Social Videos</button>
                    <button className={`tab-btn ${activeTab === 'featured' ? 'active' : ''}`} onClick={() => setActiveTab('featured')}><Palette size={16} /> Featured Menu</button>
                    <button className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}><Star size={16} /> Reseñas</button>
                    <button className={`tab-btn ${activeTab === 'schedule' ? 'active' : ''}`} onClick={() => setActiveTab('schedule')}><Clock size={16} /> Horarios</button>
                </nav>

                <main className="admin-content">
                    {activeTab === 'hero' && (
                        <div className="section-card">
                            <h2>Hero Media Slider</h2>
                            <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '1rem' }}>Rutas a vídeos o imágenes que se reproducen en el banner principal.</p>
                            <div className="item-list">
                                {localConfig.heroMedia.map((item, idx) => (
                                    <div className="list-item-card" key={idx}>
                                        <button className="remove-btn" onClick={() => handleRemoveItem('heroMedia', idx)}><Trash2 size={12} /></button>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Tipo</label>
                                                <select value={item.type} onChange={(e) => handleArrayChange('heroMedia', idx, 'type', e.target.value)}>
                                                    <option value="video">Vídeo</option>
                                                    <option value="image">Imagen</option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label>Ruta (Src)</label>
                                                <input type="text" value={item.src} onChange={(e) => handleArrayChange('heroMedia', idx, 'src', e.target.value)} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="add-btn" onClick={() => handleAddItem('heroMedia', { type: 'video', src: '/hero/nuevo.mp4' })}><Plus size={14} /> Añadir Slide</button>
                        </div>
                    )}

                    {activeTab === 'social' && (
                        <div className="section-card">
                            <h2>Social Videos (Verticales)</h2>
                            <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '1rem' }}>Player lateral. Vídeos en formato 9:16.</p>
                            <div className="item-list">
                                {localConfig.socialVideos.map((item, idx) => (
                                    <div className="list-item-card" key={idx}>
                                        <button className="remove-btn" onClick={() => handleRemoveItem('socialVideos', idx)}><Trash2 size={12} /></button>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Título</label>
                                                <input type="text" value={item.title} onChange={(e) => handleArrayChange('socialVideos', idx, 'title', e.target.value)} />
                                            </div>
                                            <div className="form-group">
                                                <label>Ruta Video</label>
                                                <input type="text" value={item.src} onChange={(e) => handleArrayChange('socialVideos', idx, 'src', e.target.value)} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="add-btn" onClick={() => handleAddItem('socialVideos', { src: '/videos/nuevo.mp4', title: 'NUEVO VIDEO 🎥' })}><Plus size={14} /> Añadir Video</button>
                        </div>
                    )}

                    {activeTab === 'featured' && (
                        <div className="section-card">
                            <h2>Featured Menu (Favoritos)</h2>
                            <div className="item-list">
                                {localConfig.featuredMenu.map((item, idx) => (
                                    <div className="list-item-card" key={idx} style={{ background: '#111827' }}>
                                        <button className="remove-btn" onClick={() => handleRemoveItem('featuredMenu', idx)}><Trash2 size={12} /></button>
                                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                            <label style={{ color: '#38bdf8', fontWeight: '700' }}>Título Categoría</label>
                                            <input type="text" value={item.title} onChange={(e) => handleArrayChange('featuredMenu', idx, 'title', e.target.value)} />
                                        </div>
                                        
                                        <div style={{ marginLeft: '1rem', borderLeft: '2px solid #334155', paddingLeft: '1rem' }}>
                                            <label style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Imágenes / Platos</label>
                                            <div className="item-list">
                                                {item.images.map((img, imgIdx) => (
                                                    <div key={imgIdx} style={{ display: 'flex', gap: '1rem', background: '#1e293b', padding: '0.5rem', borderRadius: '0.375rem', position: 'relative' }}>
                                                        <button 
                                                            style={{ position: 'absolute', right: -5, top: -5, background: '#ef4444', border: 'none', borderRadius: '50%', color: 'white', width: '20px', height: '20px', fontSize: '0.6rem', cursor: 'pointer' }}
                                                            onClick={() => handleRemoveNestedItem('featuredMenu', idx, 'images', imgIdx)}
                                                        >X</button>
                                                        <div className="form-group" style={{ flex: 1 }}>
                                                            <input type="text" placeholder="Label (Ej. Pollo)" value={img.label} onChange={(e) => handleNestedChange('featuredMenu', idx, 'images', imgIdx, { label: e.target.value })} />
                                                        </div>
                                                        <div className="form-group" style={{ flex: 2 }}>
                                                            <input type="text" placeholder="Ruta Imagen /products/..." value={img.src} onChange={(e) => handleNestedChange('featuredMenu', idx, 'images', imgIdx, { src: e.target.value })} />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <button className="add-btn" style={{ padding: '0.25rem', fontSize: '0.75rem' }} onClick={() => handleAddNestedItem('featuredMenu', idx, 'images', { src: '', label: '' })}><Plus size={10} /> Añadir Dish</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="add-btn" onClick={() => handleAddItem('featuredMenu', { title: 'NUEVA CATEGORIA', images: [] })}><Plus size={14} /> Añadir Categoría</button>
                        </div>
                    )}

                    {activeTab === 'reviews' && (
                        <div className="section-card">
                            <h2>Reseñas (Google)</h2>
                            <div className="item-list">
                                {localConfig.reviews.map((item, idx) => (
                                    <div className="list-item-card" key={idx}>
                                        <button className="remove-btn" onClick={() => handleRemoveItem('reviews', idx)}><Trash2 size={12} /></button>
                                        <div className="form-row" style={{ gridTemplateColumns: '1fr 3fr' }}>
                                            <div className="form-group">
                                                <label>Nombre</label>
                                                <input type="text" value={item.name} onChange={(e) => handleArrayChange('reviews', idx, 'name', e.target.value)} />
                                            </div>
                                            <div className="form-group">
                                                <label>Estrellas</label>
                                                <input type="number" min="1" max="5" value={item.stars} onChange={(e) => handleArrayChange('reviews', idx, 'stars', parseInt(e.target.value))} />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Texto</label>
                                            <textarea rows="3" value={item.text} onChange={(e) => handleArrayChange('reviews', idx, 'text', e.target.value)} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="add-btn" onClick={() => handleAddItem('reviews', { name: '', text: '', stars: 5 })}><Plus size={14} /> Añadir Reseña</button>
                        </div>
                    )}

                    {activeTab === 'schedule' && (
                        <div className="section-card">
                            <h2>Horarios</h2>
                            <div className="item-list">
                                {localConfig.schedule.map((item, idx) => (
                                    <div className="list-item-card" key={idx}>
                                        <div className="form-row">
                                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                                <label style={{ color: '#38bdf8' }}>{item.name}</label>
                                            </div>
                                        </div>
                                        <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr' }}>
                                            <div className="form-group">
                                                <label>Apertura (Hr)</label>
                                                <input type="number" value={item.open} onChange={(e) => handleArrayChange('schedule', idx, 'open', parseFloat(e.target.value))} />
                                            </div>
                                            <div className="form-group">
                                                <label>Cierre (Hr)</label>
                                                <input type="number" value={item.close} onChange={(e) => handleArrayChange('schedule', idx, 'close', parseFloat(e.target.value))} />
                                            </div>
                                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                                <label>Formato Texto (Label)</label>
                                                <input type="text" value={item.label} onChange={(e) => handleArrayChange('schedule', idx, 'label', e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="form-group" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                            <input type="checkbox" checked={item.closed} onChange={(e) => handleArrayChange('schedule', idx, 'closed', e.target.checked)} style={{ width: 'auto' }} />
                                            <label style={{ marginBottom: 0 }}>Cerrado hoy</label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default AdminLandingPage;
