import { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import Navbar from "../components/Navbar";
import axios from "axios";
import "../styles/styleAjustes.css";

const Ajustes = () => {
    const { user } = useAuth();
    const [settings, setSettings] = useState({
        moneda: "COP",
        impuestos: 19,
        descuentoMaximo: 10,
        backupEmail: "",
        roles: {
            admin: ["todo"],
            cajero: ["ventas", "inventario"]
        }
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await axios.get('http://localhost:3005/api/settings', {
                    withCredentials: true
                });
                setSettings(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching settings:', error);
                setLoading(false);
            }
        };
    }, []);

    const saveSettings = async () => {
        try {
            await axios.post('http://localhost:3005/api/settings', settings, {
                withCredentials: true
            });
            alert('Configuración guardada exitosamente');
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Error al guardar la configuración');
        }
    };

    const createBackup = async () => {
        try {
            await axios.post('http://localhost:3005/api/backup', {
                email: settings.backupEmail
            }, {
                withCredentials: true
            });
            alert('Copia de seguridad iniciada');
        } catch (error) {
            alert('Error al crear la copia de seguridad');
        }
    };

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value
        }));
    };

    const handleRoleChange = (role, permiso) => {
        setSettings(prev => {
            const permisos = prev.roles[role];
            const tienePermiso = permisos.includes(permiso);
            return {
                ...prev,
                roles: {
                    ...prev.roles,
                    [role]: tienePermiso
                        ? permisos.filter(p => p !== permiso)
                        : [...permisos, permiso]
                }
            };
        });
    };

    if (loading) return <div className="loading">Cargando ajustes...</div>;
    if (user?.role !== 'admin') return <div className="error">Acceso denegado</div>;

    return (
        <div className="ajustes-container">
            <Navbar />
            <div className="ajustes-content">
                <h2>Ajustes del Sistema</h2>

                <section className="config-section">
                    <h3>Configuración General</h3>
                    <div className="form-group">
                        <label>Moneda</label>
                        <select name="moneda" value={settings.moneda} onChange={handleChange}>
                            <option value="COP">Peso Colombiano (COP)</option>
                            <option value="USD">Dólar (USD)</option>
                            <option value="EUR">Euro (EUR)</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>IVA (%)</label>
                        <input
                            type="number"
                            name="impuestos"
                            value={settings.impuestos}
                            onChange={handleChange}
                            min="0"
                            max="100"
                        />
                    </div>

                    <div className="form-group">
                        <label>Descuento Máximo (%)</label>
                        <input
                            type="number"
                            name="descuentoMaximo"
                            value={settings.descuentoMaximo}
                            onChange={handleChange}
                            min="0"
                            max="100"
                        />
                    </div>
                </section>

                <section className="config-section">
                    <h3>Permisos de Usuarios</h3>
                    <div className="roles-grid">
                        <div className="role-card">
                            <h4>Administrador</h4>
                            <p>Acceso total al sistema</p>
                        </div>
                        <div className="role-card">
                            <h4>Cajero</h4>
                            <div className="permissions">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={settings.roles.cajero.includes("ventas")}
                                        onChange={() => handleRoleChange("cajero", "ventas")}
                                    />
                                    Ventas
                                </label>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={settings.roles.cajero.includes("inventario")}
                                        onChange={() => handleRoleChange("cajero", "inventario")}
                                    />
                                    Inventario
                                </label>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="config-section">
                    <h3>Copias de Seguridad</h3>
                    <div className="form-group">
                        <label>Email para respaldo</label>
                        <input
                            type="email"
                            name="backupEmail"
                            value={settings.backupEmail}
                            onChange={handleChange}
                            placeholder="email@ejemplo.com"
                        />
                    </div>
                    <button onClick={createBackup} className="btn-backup">
                        Crear Copia de Seguridad
                    </button>
                </section>

                <div className="actions">
                    <button onClick={saveSettings} className="btn-save">
                        Guardar Cambios
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Ajustes;