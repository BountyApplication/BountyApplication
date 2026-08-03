import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { toCurrency } from '../util/Util';

export default function BookingResult({ result, onConfirm }) {
    const show = result != null;
    const { oldBalance, spent, newBalance } = result || {};
    const displaySpent = spent != null ? -spent : spent;

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
