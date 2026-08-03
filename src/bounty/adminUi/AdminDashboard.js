import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { useGetUsers, useGetProducts } from '../util/Database';
import { toCurrency } from '../util/Util';
import AccountOverviewUi from '../util/AccountOverviewUi';
import ChangeMoneyUi from '../util/ChangeMoneyUi';

function Kpi({ icon, label, value }) {
    return (
        <div className="kpi-card">
            <div className="kpi-label">
                <span className="kpi-icon"><i className={`bi ${icon}`} /></span>
                {label}
            </div>
            <div className="kpi-value">{value}</div>
        </div>
    );
}

export default function AdminDashboard() {
    const users = useGetUsers();
    const allProducts = useGetProducts(null, false);

    const totalBalance = Math.round(users.reduce((s, u) => s + (u.balance || 0), 0) * 100) / 100;
    const activeProducts = allProducts.filter(p => p.active === 1).length;
    const negativeAccounts = users.filter(u => u.balance < 0).length;

    return (
        <div>
            <h1 className="admin-page-title">Übersicht</h1>
            <p className="admin-page-sub">Überblick über Konten, Guthaben und Sortiment.</p>

            <div className="kpi-grid">
                <Kpi icon="bi-people"        label="Aktive Konten"   value={users.length} />
                <Kpi icon="bi-wallet2"       label="Gesamtguthaben"  value={toCurrency(totalBalance)} />
                <Kpi icon="bi-bag-check"     label="Aktive Produkte" value={`${activeProducts} / ${allProducts.length}`} />
                <Kpi icon="bi-exclamation-circle" label="Negative Konten" value={negativeAccounts} />
            </div>

            <Row className="g-4">
                <Col xs={12} xl={8}>
                    <AccountOverviewUi embedded />
                </Col>
                <Col xs={12} xl={4}>
                    <ChangeMoneyUi embedded />
                </Col>
            </Row>
        </div>
    );
}
