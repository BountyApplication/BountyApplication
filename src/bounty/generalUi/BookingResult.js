import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { toCurrency } from '../util/Util';

export default function BookingResult({ result, onConfirm }) {
    const show = result != null;
    const { oldBalance, spent, newBalance, products } = result || {};
    const displaySpent = spent != null ? -spent : spent;
    const boughtProducts = (products || []).filter(({ amount }) => amount !== 0);

    return (
        <Modal show={show} centered backdrop="static" keyboard={false}>
            <Modal.Header className="border-0 pb-0">
                <Modal.Title className="fs-4 fw-bold d-flex align-items-center gap-2">
                    <i className="bi bi-check-circle-fill text-success" />
                    Buchung abgeschlossen
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex justify-content-between align-items-center py-2">
                    <span className="text-muted">Alter Betrag</span>
                    <span className="fs-5">{toCurrency(oldBalance)}</span>
                </div>
                {boughtProducts.length > 0 && (
                    <div className="py-2 border-top overflow-auto" style={{ maxHeight: '30vh' }}>
                        {boughtProducts.map(({ productId, name, price, amount }) => (
                            <div key={productId} className="d-flex justify-content-between align-items-center py-1">
                                <span className="text-truncate me-2" title={name}>
                                    <span className="text-muted me-1">{amount}×</span>{name}
                                </span>
                                <span className="text-nowrap">{toCurrency(price * amount)}</span>
                            </div>
                        ))}
                    </div>
                )}
                <div className="d-flex justify-content-between align-items-center py-2 border-top">
                    <span className="text-muted">Ausgegeben</span>
                    <span className="fs-5">{displaySpent > 0 ? '+' : ''}{toCurrency(displaySpent)}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center py-2 border-top">
                    <span className="fw-semibold fs-5">Neuer Betrag</span>
                    <span className={`fw-bold fs-3 ${newBalance < 0 ? 'text-danger' : ''}`}>
                        {toCurrency(newBalance)}
                    </span>
                </div>
            </Modal.Body>
            <Modal.Footer className="border-0">
                <Button variant="primary" size="lg" className="w-100" onClick={onConfirm}>
                    <i className="bi bi-check-lg me-1" />OK
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
