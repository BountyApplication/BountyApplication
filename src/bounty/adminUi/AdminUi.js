import React, { useContext, useEffect } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import AdminDashboard from './AdminDashboard';
import UserManagement from './UserManagement';
import ProductManagement from './ProductManagement';
import ClosingUi from './ClosingUi';
import { ThemeContext } from "../../themes/ThemeProvider.js";
import { isAdminUnlocked } from '../util/adminAuth';

const NAV = [
    { hash: '#dashboard', label: 'Übersicht', icon: 'bi-grid-1x2' },
    { hash: '#users',     label: 'Benutzer',  icon: 'bi-people'   },
    { hash: '#products',  label: 'Produkte',  icon: 'bi-bag'      },
    { hash: '#closing',   label: 'Abschluss', icon: 'bi-flag'     },
];

export default function AdminUi() {
    const location = useLocation();
    const navigate = useNavigate();
    const active = location.hash || '#dashboard';
    const { theme, toggleTheme } = useContext(ThemeContext);

    useEffect(() => {
        if (!isAdminUnlocked()) navigate('/', { replace: true });
    }, [navigate]);

    if (!isAdminUnlocked()) return null;

    return (
        <div className="admin-shell">
            <aside className="admin-sidebar">
                <div className="pos-brand px-2">
                    <span className="pos-brand-mark"><i className="bi bi-cup-straw" /></span>
                    <span>Bounty</span>
                </div>

                <nav className="admin-nav">
                    {NAV.map(({ hash, label, icon }) => (
                        <a
                            key={hash}
                            href={hash}
                            className={`admin-nav-item ${active === hash ? 'active' : ''}`}
                        >
                            <i className={`bi ${icon}`} />
                            <span>{label}</span>
                        </a>
                    ))}
                </nav>

                <div className="mt-auto d-flex flex-column gap-2 px-1">
                    <button className="admin-nav-item" onClick={toggleTheme}>
                        <i className={`bi ${theme === 'light-theme' ? 'bi-moon-stars' : 'bi-sun'}`} />
                        <span>{theme === 'light-theme' ? 'Dunkles Design' : 'Helles Design'}</span>
                    </button>
                    <Link to="/" className="admin-nav-item">
                        <i className="bi bi-arrow-left-circle" />
                        <span>Zur Kasse</span>
                    </Link>
                </div>
            </aside>

            <main className="admin-content">
                {active === '#dashboard' && <AdminDashboard />}
                {active === '#users'     && <UserManagement />}
                {active === '#products'  && <ProductManagement />}
                {active === '#closing'   && <ClosingUi />}
            </main>
        </div>
    );
}
