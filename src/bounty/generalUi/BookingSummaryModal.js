import { Modal, Button, Table } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useEffect } from 'react';

BookingSummaryModal.propTypes = {
    show: PropTypes.bool.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    oldBalance: PropTypes.number,
    spent: PropTypes.number,
    newBalance: PropTypes.number,
};

export default function BookingSummaryModal({ show, onConfirm, onCancel, oldBalance, spent, newBalance }) {
    useEffect(() => {
        if(!show) return;
        function handleKeyDown(e) {
            if(e.key === 'Enter')  { e.stopPropagation(); onConfirm(); }
        }
        document.addEventListener('keydown', handleKeyDown, true);
        return () => document.removeEventListener('keydown', handleKeyDown, true);
    }, [show, onConfirm]);

    return (
        <Modal show={show} onHide={onCancel} centered>
            <Modal.Header>
                <Modal.Title>Buchung bestätigen</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Table borderless className="mb-0">
                    <tbody>
                        <tr>
                            <td>Alter Betrag</td>
                            <td className="text-end">{oldBalance?.toFixed(2)} €</td>
                        </tr>
                        <tr>
                            <td>Ausgegeben</td>
                            <td className="text-end">{spent?.toFixed(2)} €</td>
                        </tr>
                        <tr className="fw-bold">
                            <td>Neuer Betrag</td>
                            <td className="text-end">{newBalance?.toFixed(2)} €</td>
                        </tr>
                    </tbody>
                </Table>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-danger" onClick={onCancel}>Abbrechen</Button>
                <Button variant="outline-success" onClick={onConfirm}>Bestätigen</Button>
            </Modal.Footer>
        </Modal>
    );
}
