import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, InputGroup } from 'react-bootstrap';
import { checkAdminPassword, unlockAdmin } from './adminAuth';

export default function AdminPasswordModal({ show, onClose, onSuccess }) {
    const [value, setValue] = useState('');
    const [error, setError] = useState(false);

    useEffect(() => {
        if (show) { setValue(''); setError(false); }
    }, [show]);

    function submit(e) {
        e?.preventDefault();
        if (checkAdminPassword(value)) {
            unlockAdmin();
            onSuccess();
        } else {
            setError(true);
        }
    }

    return (
        <Modal show={show} onHide={onClose} centered size="sm">
            <Modal.Header closeButton>
                <Modal.Title className="fs-5">
                    <i className="bi bi-lock me-2" />Verwaltung
                </Modal.Title>
            </Modal.Header>
            <Form onSubmit={submit}>
                <Modal.Body>
                    <Form.Label className="text-muted small">Passwort eingeben</Form.Label>
                    <InputGroup>
                        <InputGroup.Text><i className="bi bi-key" /></InputGroup.Text>
                        <Form.Control
                            type="password"
                            autoFocus
                            value={value}
                            isInvalid={error}
                            onChange={e => { setValue(e.target.value); setError(false); }}
                        />
                    </InputGroup>
                    {error && <div className="text-danger small mt-2">Falsches Passwort</div>}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={onClose}>Abbrechen</Button>
                    <Button variant="primary" type="submit">
                        <i className="bi bi-unlock me-1" />Öffnen
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}
