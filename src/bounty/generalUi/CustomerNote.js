import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';

CustomerNote.propTypes = {
    user: PropTypes.object,
    note: PropTypes.string,
    onConfirm: PropTypes.func.isRequired,
};

export default function CustomerNote({ user, note, onConfirm }) {
    return (
        <Modal show={note != null} centered backdrop="static" keyboard={false}>
            <Modal.Header className="border-0 pb-0">
                <Modal.Title className="fs-4 fw-bold d-flex align-items-center gap-2">
                    <i className="bi bi-exclamation-triangle-fill text-warning" />
                    Achtung
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {user != null && (
                    <div className="text-muted mb-2">{user.firstname} {user.lastname}</div>
                )}
                <div className="fs-5">{note}</div>
            </Modal.Body>
            <Modal.Footer className="border-0">
                <Button variant="warning" size="lg" className="w-100" onClick={onConfirm}>
                    <i className="bi bi-check-lg me-1" />Verstanden
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
