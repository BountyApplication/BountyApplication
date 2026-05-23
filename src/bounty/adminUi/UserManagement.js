import React, { useState } from 'react';
import { Card, Table, Button, Modal, Form, InputGroup } from 'react-bootstrap';
import { useGetUsers, addUser, changeUser, removeUser } from '../util/Database';
import { toCurrency } from '../util/Util';
import Confirm from '../util/Confirm';

const changeBalance = process.env.REACT_APP_CHANGE_BALANCE === 'true';
const empty = { firstname: '', lastname: '', balance: '' };

export default function UserManagement() {
    const users = useGetUsers(null, false);
    const [search, setSearch] = useState('');
    const [editing, setEditing] = useState(null);   // null | 'new' | userObject
    const [form, setForm] = useState(empty);
    const [removeTarget, setRemoveTarget] = useState(null);

    const filtered = [...users]
        .filter(u => `${u.firstname} ${u.lastname}`.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => a.firstname.localeCompare(b.firstname));

    function openNew() {
        setForm({ ...empty });
        setEditing('new');
    }

    function openEdit(user) {
        setForm({
            firstname: user.firstname,
            lastname: user.lastname,
            balance: user.balance,
            active: user.active,
        });
        setEditing(user);
    }

    function close() {
        setEditing(null);
        setForm(empty);
    }

    function valid() {
        const balanceOk = editing === 'new' || changeBalance
            ? form.balance !== '' && form.balance !== null && !isNaN(parseFloat(form.balance))
            : true;
        return form.firstname.trim() && form.lastname.trim() && balanceOk;
    }

    function save() {
        if (!valid()) return;
        if (editing === 'new') {
            addUser(form.firstname.trim(), form.lastname.trim(), parseFloat(form.balance));
        } else {
            const updated = {
                ...editing,
                firstname: form.firstname.trim(),
                lastname: form.lastname.trim(),
                active: form.active,
            };
            if (changeBalance) updated.balance = parseFloat(form.balance);
            changeUser(updated);
        }
        close();
    }

    function doRemove() {
        if (removeTarget) removeUser(removeTarget);
        setRemoveTarget(null);
    }

    return (
        <div>
            <div className="d-flex flex-wrap align-items-center gap-3 mb-4">
                <div className="me-auto">
                    <h1 className="admin-page-title mb-0">Benutzer</h1>
                    <p className="admin-page-sub mb-0">{users.length} Konten verwalten</p>
                </div>
                <InputGroup style={{ maxWidth: '260px' }}>
                    <InputGroup.Text><i className="bi bi-search" /></InputGroup.Text>
                    <Form.Control
                        placeholder="Suchen…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </InputGroup>
                <Button variant="primary" onClick={openNew}>
                    <i className="bi bi-person-plus me-1" />Benutzer anlegen
                </Button>
            </div>

            <Card className="shadow-sm">
                <Card.Body className="p-0">
                    <Table hover responsive className="mb-0 align-middle">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th className="text-end">Kontostand</th>
                                <th>Status</th>
                                <th className="text-end">Aktionen</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 && (
                                <tr><td colSpan={4} className="text-center text-muted py-4">Keine Benutzer gefunden</td></tr>
                            )}
                            {filtered.map(user => (
                                <tr key={user.userId}>
                                    <td className="fw-semibold">{user.firstname} {user.lastname}</td>
                                    <td className={`text-end fw-semibold ${user.balance < 0 ? 'text-danger' : ''}`}>
                                        {toCurrency(user.balance)}
                                    </td>
                                    <td>
                                        <span className={`status-dot ${user.active === 1 ? 'on' : 'off'}`} />
                                        <span className="text-muted small">{user.active === 1 ? 'Aktiv' : 'Inaktiv'}</span>
                                    </td>
                                    <td className="text-end">
                                        <Button size="sm" variant="outline-secondary" className="me-2" onClick={() => openEdit(user)}>
                                            <i className="bi bi-pencil" />
                                        </Button>
                                        {user.active === 1 && (
                                            <Button size="sm" variant="outline-danger" onClick={() => setRemoveTarget(user)}>
                                                <i className="bi bi-person-x" />
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            {/* Add / edit modal */}
            <Modal show={editing !== null} onHide={close} centered>
                <Modal.Header closeButton>
                    <Modal.Title className="fs-5">
                        {editing === 'new' ? 'Benutzer anlegen' : 'Benutzer bearbeiten'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Vorname</Form.Label>
                            <Form.Control
                                autoFocus
                                value={form.firstname}
                                onChange={e => setForm({ ...form, firstname: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Nachname</Form.Label>
                            <Form.Control
                                value={form.lastname}
                                onChange={e => setForm({ ...form, lastname: e.target.value })}
                            />
                        </Form.Group>
                        {(editing === 'new' || changeBalance) && (
                            <Form.Group className="mb-3">
                                <Form.Label>{editing === 'new' ? 'Startguthaben' : 'Kontostand'}</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        type="number"
                                        step="0.01"
                                        value={form.balance}
                                        onChange={e => setForm({ ...form, balance: e.target.value })}
                                    />
                                    <InputGroup.Text>€</InputGroup.Text>
                                </InputGroup>
                            </Form.Group>
                        )}
                        {editing !== 'new' && (
                            <Form.Check
                                type="switch"
                                id="user-active"
                                label={form.active === 1 ? 'Aktiv' : 'Inaktiv'}
                                checked={form.active === 1}
                                onChange={() => setForm({ ...form, active: form.active ? 0 : 1 })}
                            />
                        )}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={close}>Abbrechen</Button>
                    <Button variant="primary" onClick={save} disabled={!valid()}>
                        <i className="bi bi-check-lg me-1" />Speichern
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Remove confirm */}
            <Modal show={removeTarget !== null} onHide={() => setRemoveTarget(null)} centered>
                <Modal.Body className="p-4">
                    <Confirm
                        title="Benutzer entfernen"
                        text={`Benutzer "${removeTarget?.firstname} ${removeTarget?.lastname}" wirklich entfernen?`}
                        run={doRemove}
                        show
                        setShow={(v) => { if (!v) setRemoveTarget(null); }}
                        danger
                    />
                </Modal.Body>
            </Modal>
        </div>
    );
}
