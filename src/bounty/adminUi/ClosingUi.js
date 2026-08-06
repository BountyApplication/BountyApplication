import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Alert, Table, Badge } from 'react-bootstrap';
import { useGetSettings, setSetting, useGetSummary, useGetUsers } from '../util/Database';
import { toCurrency } from '../util/Util';
import Confirm from '../util/Confirm';

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

export default function ClosingUi() {
    const settings = useGetSettings();
    const summary = useGetSummary();
    const users = useGetUsers();
    const [confirmOn, setConfirmOn] = useState(false);
    // shows the new state right away, the polled value only arrives seconds later
    const [pending, setPending] = useState(null);

    const storedMode = settings?.payout === 'on';
    const payoutMode = pending ?? storedMode;

    useEffect(() => {
        if (pending != null && pending === storedMode) setPending(null);
    }, [pending, storedMode]);

    function toggle() {
        if (!payoutMode) return setConfirmOn(true);
        setPending(false);
        setSetting('payout', 'off');
    }

    function enable() {
        setPending(true);
        setSetting('payout', 'on');
    }

    const exportUrl = `http://${process.env.REACT_APP_DB_IP}:${process.env.REACT_APP_DB_PORT}/bounty/closing`;

    // biggest amounts first, that is what still has to be handed out
    const openAccounts = users
        .filter(({ balance }) => balance !== 0)
        .sort((a, b) => b.balance - a.balance);

    return (
        <div>
            <h1 className="admin-page-title">Abschluss</h1>
            <p className="admin-page-sub">Auszahlung freischalten und Spenden auswerten.</p>

            <Card className="shadow-sm mb-4">
                <Card.Body className="d-flex align-items-center justify-content-between gap-3 flex-wrap">
                    <div>
                        <Form.Check
                            type="switch"
                            id="payout-mode"
                            className="fs-5"
                            label={payoutMode ? 'Auszahlung aktiv' : 'Auszahlung gesperrt'}
                            checked={payoutMode}
                            onChange={toggle}
                        />
                        <span className="text-muted small">
                            Schaltet an allen Kassen die Schaltflächen "Alles auszahlen" und "Rest spenden"
                            sowie den Spendenkanal frei. Die Kassen übernehmen die Änderung innerhalb weniger Sekunden.
                        </span>
                    </div>
                </Card.Body>
            </Card>

            <Confirm
                show={confirmOn}
                setShow={setConfirmOn}
                text="Auszahlung an allen Kassen freischalten?"
                run={enable}
            />

            {payoutMode && (
                <Alert variant="warning" className="d-flex align-items-center gap-2">
                    <i className="bi bi-exclamation-triangle-fill" />
                    Die Auszahlung ist an allen Kassen freigeschaltet.
                </Alert>
            )}

            <div className="kpi-grid">
                <Kpi icon="bi-heart"     label="Spenden gesamt"    value={toCurrency(summary?.donation ?? 0)} />
                <Kpi icon="bi-cash-coin" label="Ausgezahlt"        value={toCurrency(summary?.paidOut ?? 0)} />
                <Kpi icon="bi-piggy-bank" label="Eingezahlt"       value={toCurrency(summary?.paidIn ?? 0)} />
                <Kpi icon="bi-bag-check" label="Warenumsatz"       value={toCurrency(summary?.productSum ?? 0)} />
                <Kpi icon="bi-wallet2"   label="Offene Guthaben"   value={toCurrency(summary?.openBalance ?? 0)} />
                <Kpi icon="bi-people"    label="Konten mit Rest"   value={summary?.openAccounts ?? 0} />
                <Kpi icon="bi-cup"       label="Offenes Pfand"     value={summary?.openDeposit ?? 0} />
            </div>

            <Card className="shadow-sm mt-4">
                <Card.Header className="d-flex align-items-center justify-content-between gap-3 flex-wrap">
                    <Card.Title className="mb-0 fw-semibold">
                        <i className="bi bi-wallet2 me-2" />
                        Konten mit Restguthaben
                        <Badge bg="secondary" className="ms-2">{openAccounts.length}</Badge>
                    </Card.Title>
                    <Button size="sm" variant="outline-secondary" href={exportUrl} target="_blank" rel="noreferrer">
                        <i className="bi bi-download me-1" />CSV
                    </Button>
                </Card.Header>
                <Card.Body className="p-0">
                    <div className="overflow-auto" style={{ maxHeight: '55vh' }}>
                        <Table striped hover className="mb-0 align-middle">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th className="text-center">Pfand</th>
                                    <th className="text-end">Guthaben</th>
                                </tr>
                            </thead>
                            <tbody>
                                {openAccounts.length === 0 && (
                                    <tr><td colSpan={3} className="text-center text-muted py-4">Alle Konten sind ausgeglichen</td></tr>
                                )}
                                {openAccounts.map(({ userId, firstname, lastname, balance, deposit }) => (
                                    <tr key={userId}>
                                        <td>{firstname} {lastname}</td>
                                        <td className="text-center">
                                            {deposit > 0
                                                ? <Badge bg="" className="deposit-badge">{deposit}</Badge>
                                                : <span className="text-muted">—</span>
                                            }
                                        </td>
                                        <td className={`text-end fw-semibold ${balance < 0 ? 'text-danger' : ''}`}>
                                            {toCurrency(balance)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
}
