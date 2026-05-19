import React, { useState } from 'react';
import { Tab, Tabs, Table, Button, Modal, Form, Badge, Card, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {
    useGetUsers, useGetProducts, useGetUserBalance,
    addUser, removeUser, changeUser,
    addProduct, removeProduct, changeProduct,
} from '../util/Database';

const changeBalance = process.env.REACT_APP_CHANGE_BALANCE === 'true';

// -- Confirm Modal --

function ConfirmModal({ show, title, text, danger, onConfirm, onCancel }) {
    return (
        <Modal show={show} onHide={onCancel} centered>
            <Modal.Header closeButton><Modal.Title>{title}</Modal.Title></Modal.Header>
            <Modal.Body>{text}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onCancel}>Abbrechen</Button>
                <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm}>Bestätigen</Button>
            </Modal.Footer>
        </Modal>
    );
}

// -- Add User Modal --

function AddUserModal({ show, onClose }) {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [balance, setBalance] = useState('');

    const isValid = firstname !== '' && lastname !== '' && balance !== '' && !isNaN(parseFloat(balance));

    function handleSubmit() {
        if (!isValid) return;
        addUser(firstname, lastname, parseFloat(balance));
        setFirstname(''); setLastname(''); setBalance('');
        onClose();
    }

    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton><Modal.Title>Benutzer hinzufügen</Modal.Title></Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Vorname</Form.Label>
                        <Form.Control value={firstname} onChange={e => setFirstname(e.target.value)} autoFocus />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Nachname</Form.Label>
                        <Form.Control value={lastname} onChange={e => setLastname(e.target.value)} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Startguthaben (€)</Form.Label>
                        <Form.Control type="number" step="0.01" value={balance} onChange={e => setBalance(e.target.value)} />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Abbrechen</Button>
                <Button onClick={handleSubmit} disabled={!isValid}>Hinzufügen</Button>
            </Modal.Footer>
        </Modal>
    );
}

// -- User Edit Row (separate component so useGetUserBalance hook is valid) --

function UserEditRow({ user, onSave, onCancel }) {
    const currentBalance = useGetUserBalance(user);
    const [firstname, setFirstname] = useState(user.firstname);
    const [lastname, setLastname] = useState(user.lastname);
    const [active, setActive] = useState(user.active);
    const [balance, setBalance] = useState('');

    function save() {
        const updated = { ...user, firstname, lastname, active };
        if (changeBalance && balance !== '') updated.balance = parseFloat(balance);
        onSave(updated);
    }

    return (
        <tr>
            <td><Form.Control size="sm" value={firstname} onChange={e => setFirstname(e.target.value)} autoFocus /></td>
            <td><Form.Control size="sm" value={lastname} onChange={e => setLastname(e.target.value)} /></td>
            {changeBalance && (
                <td>
                    <Form.Control
                        size="sm" type="number" step="0.01" style={{ width: '90px' }}
                        placeholder={currentBalance?.toFixed(2) ?? ''}
                        value={balance}
                        onChange={e => setBalance(e.target.value)}
                    />
                </td>
            )}
            <td>
                <Form.Check type="switch" checked={active === 1} label="Aktiv"
                    onChange={() => setActive(active ? 0 : 1)} />
            </td>
            <td className="text-end text-nowrap">
                <Button size="sm" variant="success" onClick={save} className="me-1">
                    <i className="bi bi-check-lg" />
                </Button>
                <Button size="sm" variant="outline-secondary" onClick={onCancel}>
                    <i className="bi bi-x-lg" />
                </Button>
            </td>
        </tr>
    );
}

// -- User Section --

function UserSection() {
    const users = useGetUsers(null, false);
    const [editingId, setEditingId] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [showAdd, setShowAdd] = useState(false);

    function saveEdit(updated) {
        changeUser(updated);
        setEditingId(null);
    }

    function confirmDelete() {
        removeUser(deleteTarget);
        setDeleteTarget(null);
    }

    return (
        <>
            <Card>
                <Card.Header className="d-flex justify-content-between align-items-center">
                    <span className="fw-semibold fs-5">Benutzer</span>
                    <Button size="sm" onClick={() => setShowAdd(true)}>
                        <i className="bi bi-person-plus me-1" />Hinzufügen
                    </Button>
                </Card.Header>
                <div className="table-responsive">
                    <Table hover className="mb-0 align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>Vorname</th>
                                <th>Nachname</th>
                                {changeBalance && <th>Guthaben</th>}
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => editingId === user.userId
                                ? <UserEditRow key={user.userId} user={user} onSave={saveEdit} onCancel={() => setEditingId(null)} />
                                : (
                                    <tr key={user.userId} className={user.active !== 1 ? 'text-muted fst-italic' : ''}>
                                        <td>{user.firstname}</td>
                                        <td>{user.lastname}</td>
                                        {changeBalance && <td>—</td>}
                                        <td>
                                            <Badge bg={user.active === 1 ? 'success' : 'secondary'}>
                                                {user.active === 1 ? 'Aktiv' : 'Inaktiv'}
                                            </Badge>
                                        </td>
                                        <td className="text-end text-nowrap">
                                            <Button size="sm" variant="outline-primary" className="me-1"
                                                onClick={() => setEditingId(user.userId)}>
                                                <i className="bi bi-pencil" />
                                            </Button>
                                            <Button size="sm" variant="outline-danger"
                                                onClick={() => setDeleteTarget(user)}>
                                                <i className="bi bi-trash3" />
                                            </Button>
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </Table>
                </div>
            </Card>

            <AddUserModal show={showAdd} onClose={() => setShowAdd(false)} />

            <ConfirmModal
                show={deleteTarget !== null}
                title="Benutzer entfernen"
                danger
                text={deleteTarget ? `Willst du ${deleteTarget.firstname} ${deleteTarget.lastname} wirklich entfernen?` : ''}
                onConfirm={confirmDelete}
                onCancel={() => setDeleteTarget(null)}
            />
        </>
    );
}

// -- Add Product Modal --

function AddProductModal({ show, onClose }) {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');

    const isValid = name !== '' && price !== '' && !isNaN(parseFloat(price));

    function handleSubmit() {
        if (!isValid) return;
        addProduct(name, parseFloat(price));
        setName(''); setPrice('');
        onClose();
    }

    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton><Modal.Title>Produkt hinzufügen</Modal.Title></Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control value={name} onChange={e => setName(e.target.value)} autoFocus />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Preis (€)</Form.Label>
                        <Form.Control type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Abbrechen</Button>
                <Button onClick={handleSubmit} disabled={!isValid}>Hinzufügen</Button>
            </Modal.Footer>
        </Modal>
    );
}

// -- Product Section --

function ProductSection() {
    const products = useGetProducts(null, false);
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [showAdd, setShowAdd] = useState(false);
    const [dragFrom, setDragFrom] = useState(null);
    const [dragOver, setDragOver] = useState(null);

    function startEdit(product) {
        setEditingId(product.productId);
        setEditData({ name: product.name, price: product.price, active: product.active });
    }

    function saveEdit(product) {
        changeProduct({ ...product, name: editData.name, price: parseFloat(editData.price), active: editData.active });
        setEditingId(null);
    }

    function confirmDelete() {
        removeProduct(deleteTarget);
        setDeleteTarget(null);
    }

    function moveUp(place) {
        if (place === 0) return;
        const a = products.find(p => p.place === place);
        const b = products.find(p => p.place === place - 1);
        changeProduct({ ...a, place: place - 1 });
        changeProduct({ ...b, place: place });
    }

    function moveDown(place) {
        if (place === products.length - 1) return;
        const a = products.find(p => p.place === place);
        const b = products.find(p => p.place === place + 1);
        changeProduct({ ...a, place: place + 1 });
        changeProduct({ ...b, place: place });
    }

    function handleDrop(toPlace) {
        if (dragFrom === null || dragFrom === toPlace) { setDragFrom(null); setDragOver(null); return; }
        const sorted = [...products].sort((a, b) => a.place - b.place);
        const fromIdx = sorted.findIndex(p => p.place === dragFrom);
        const toIdx = sorted.findIndex(p => p.place === toPlace);
        const [moved] = sorted.splice(fromIdx, 1);
        sorted.splice(toIdx, 0, moved);
        sorted.forEach((p, idx) => { if (p.place !== idx) changeProduct({ ...p, place: idx }); });
        setDragFrom(null);
        setDragOver(null);
    }

    return (
        <>
            <Card>
                <Card.Header className="d-flex justify-content-between align-items-center">
                    <span className="fw-semibold fs-5">Produkte</span>
                    <Button size="sm" onClick={() => setShowAdd(true)}>
                        <i className="bi bi-plus-circle me-1" />Hinzufügen
                    </Button>
                </Card.Header>
                <div className="table-responsive">
                    <Table hover className="mb-0 align-middle">
                        <thead className="table-light">
                            <tr>
                                <th style={{ width: '1%' }}></th>
                                <th>#</th>
                                <th>Name</th>
                                <th>Preis</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => editingId === product.productId
                                ? (
                                    <tr key={product.productId}>
                                        <td></td>
                                        <td className="text-muted">{product.place}</td>
                                        <td>
                                            <Form.Control size="sm" value={editData.name}
                                                onChange={e => setEditData({ ...editData, name: e.target.value })}
                                                autoFocus />
                                        </td>
                                        <td>
                                            <Form.Control size="sm" type="number" step="0.01" style={{ width: '90px' }}
                                                value={editData.price}
                                                onChange={e => setEditData({ ...editData, price: e.target.value })} />
                                        </td>
                                        <td>
                                            <Form.Check type="switch" checked={editData.active === 1} label="Aktiv"
                                                onChange={() => setEditData({ ...editData, active: editData.active ? 0 : 1 })} />
                                        </td>
                                        <td className="text-end text-nowrap">
                                            <Button size="sm" variant="success" onClick={() => saveEdit(product)} className="me-1">
                                                <i className="bi bi-check-lg" />
                                            </Button>
                                            <Button size="sm" variant="outline-secondary" onClick={() => setEditingId(null)}>
                                                <i className="bi bi-x-lg" />
                                            </Button>
                                        </td>
                                    </tr>
                                ) : (
                                    <tr
                                        key={product.productId}
                                        draggable
                                        onDragStart={() => setDragFrom(product.place)}
                                        onDragOver={e => { e.preventDefault(); setDragOver(product.place); }}
                                        onDragLeave={() => setDragOver(null)}
                                        onDrop={() => handleDrop(product.place)}
                                        onDragEnd={() => { setDragFrom(null); setDragOver(null); }}
                                        className={product.active !== 1 ? 'text-muted fst-italic' : ''}
                                        style={dragOver === product.place && dragFrom !== product.place
                                            ? { outline: '2px dashed #0d6efd', backgroundColor: 'rgba(13,110,253,0.06)' }
                                            : undefined}
                                    >
                                        <td style={{ cursor: 'grab', color: '#aaa' }}>
                                            <i className="bi bi-grip-vertical" />
                                        </td>
                                        <td>{product.place}</td>
                                        <td>{product.name}</td>
                                        <td>{product.price?.toFixed(2)} €</td>
                                        <td>
                                            <Badge bg={product.active === 1 ? 'success' : 'secondary'}>
                                                {product.active === 1 ? 'Aktiv' : 'Inaktiv'}
                                            </Badge>
                                        </td>
                                        <td className="text-end text-nowrap">
                                            <Button size="sm" variant="outline-secondary" className="me-1"
                                                onClick={() => moveUp(product.place)} disabled={product.place === 0}>
                                                <i className="bi bi-arrow-up" />
                                            </Button>
                                            <Button size="sm" variant="outline-secondary" className="me-1"
                                                onClick={() => moveDown(product.place)} disabled={product.place === products.length - 1}>
                                                <i className="bi bi-arrow-down" />
                                            </Button>
                                            <Button size="sm" variant="outline-primary" className="me-1"
                                                onClick={() => startEdit(product)}>
                                                <i className="bi bi-pencil" />
                                            </Button>
                                            <Button size="sm" variant="outline-danger"
                                                onClick={() => setDeleteTarget(product)}>
                                                <i className="bi bi-trash3" />
                                            </Button>
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </Table>
                </div>
            </Card>

            <AddProductModal show={showAdd} onClose={() => setShowAdd(false)} />

            <ConfirmModal
                show={deleteTarget !== null}
                title="Produkt entfernen"
                danger
                text={deleteTarget ? `Willst du "${deleteTarget.name}" (${deleteTarget.price?.toFixed(2)} €) wirklich entfernen?` : ''}
                onConfirm={confirmDelete}
                onCancel={() => setDeleteTarget(null)}
            />
        </>
    );
}

// -- Main --

export default function AdminUiV2() {
    return (
        <Container className="py-4">
            <div className="d-flex align-items-center mb-4">
                <h2 className="mb-0 me-3">Admin</h2>
                <Link to="/" className="btn btn-outline-secondary ms-auto">
                    <i className="bi bi-house me-1" />Zurück
                </Link>
            </div>
            <Tabs defaultActiveKey="users" className="mb-3">
                <Tab eventKey="users" title={<><i className="bi bi-people me-1" />Benutzer</>}>
                    <UserSection />
                </Tab>
                <Tab eventKey="products" title={<><i className="bi bi-box-seam me-1" />Produkte</>}>
                    <ProductSection />
                </Tab>
            </Tabs>
        </Container>
    );
}
