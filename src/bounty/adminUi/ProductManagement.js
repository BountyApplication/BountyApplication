import React, { useState } from 'react';
import { Card, Table, Button, Modal, Form, InputGroup, Badge } from 'react-bootstrap';
import { useGetProducts, addProduct, changeProduct, removeProduct } from '../util/Database';
import { toCurrency } from '../util/Util';
import Confirm from '../util/Confirm';

const empty = { name: '', price: '', stock: '', deposit: 0 };

function stockLabel(stock) {
    if (stock === null || stock === undefined || stock === '') {
        return <span className="text-muted"><i className="bi bi-infinity" /></span>;
    }
    if (stock <= 0) return <Badge bg="danger">Ausverkauft</Badge>;
    return <span className="fw-semibold">{stock}</span>;
}

export default function ProductManagement() {
    const products = useGetProducts(null, false);
    const [editing, setEditing] = useState(null);   // null | 'new' | productObject
    const [form, setForm] = useState(empty);
    const [removeTarget, setRemoveTarget] = useState(null);

    const [dragIndex, setDragIndex] = useState(null);
    const [overIndex, setOverIndex] = useState(null);

    // ── reordering ───────────────────────────────────────────
    function persistOrder(ordered) {
        ordered.forEach((p, idx) => {
            if (p.place !== idx) changeProduct({ ...p, place: idx });
        });
    }

    function move(index, dir) {
        const target = index + dir;
        if (target < 0 || target >= products.length) return;
        const ordered = [...products];
        [ordered[index], ordered[target]] = [ordered[target], ordered[index]];
        persistOrder(ordered);
    }

    function onDrop(targetIndex) {
        if (dragIndex !== null && dragIndex !== targetIndex) {
            const ordered = [...products];
            const [moved] = ordered.splice(dragIndex, 1);
            ordered.splice(targetIndex, 0, moved);
            persistOrder(ordered);
        }
        setDragIndex(null);
        setOverIndex(null);
    }

    // ── add / edit ───────────────────────────────────────────
    function openNew() {
        setForm({ ...empty });
        setEditing('new');
    }

    function openEdit(product) {
        setForm({
            name: product.name,
            price: product.price,
            stock: product.stock ?? '',
            deposit: product.deposit ?? 0,
            active: product.active,
        });
        setEditing(product);
    }

    function close() {
        setEditing(null);
        setForm(empty);
    }

    function valid() {
        const priceOk = form.price !== '' && form.price !== null && !isNaN(parseFloat(form.price));
        const stockOk = form.stock === '' || (!isNaN(parseInt(form.stock)) && parseInt(form.stock) >= 0);
        return form.name.trim() && priceOk && stockOk;
    }

    function save() {
        if (!valid()) return;
        const stock = form.stock === '' ? null : parseInt(form.stock);
        const deposit = parseInt(form.deposit) || 0;
        if (editing === 'new') {
            addProduct(form.name.trim(), parseFloat(form.price), stock, deposit);
        } else {
            changeProduct({
                ...editing,
                name: form.name.trim(),
                price: parseFloat(form.price),
                active: form.active,
                stock,
                deposit,
            });
        }
        close();
    }

    function doRemove() {
        if (removeTarget) removeProduct(removeTarget);
        setRemoveTarget(null);
    }

    return (
        <div>
            <div className="d-flex flex-wrap align-items-center gap-3 mb-4">
                <div className="me-auto">
                    <h1 className="admin-page-title mb-0">Produkte</h1>
                    <p className="admin-page-sub mb-0">{products.length} Artikel · zum Sortieren ziehen</p>
                </div>
                <Button variant="primary" onClick={openNew}>
                    <i className="bi bi-bag-plus me-1" />Produkt hinzufügen
                </Button>
            </div>

            <Card className="shadow-sm">
                <Card.Body className="p-0">
                    <Table hover responsive className="mb-0 align-middle">
                        <thead>
                            <tr>
                                <th style={{ width: '6.5rem' }}>Position</th>
                                <th>Produkt</th>
                                <th className="text-end">Preis</th>
                                <th className="text-center">Bestand</th>
                                <th>Status</th>
                                <th className="text-end">Aktionen</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length === 0 && (
                                <tr><td colSpan={6} className="text-center text-muted py-4">Keine Produkte vorhanden</td></tr>
                            )}
                            {products.map((product, index) => (
                                <tr
                                    key={product.productId}
                                    className={`drag-row ${dragIndex === index ? 'dragging' : ''} ${overIndex === index && dragIndex !== index ? 'drag-over' : ''}`}
                                    draggable
                                    onDragStart={() => setDragIndex(index)}
                                    onDragOver={(e) => { e.preventDefault(); setOverIndex(index); }}
                                    onDragEnd={() => { setDragIndex(null); setOverIndex(null); }}
                                    onDrop={(e) => { e.preventDefault(); onDrop(index); }}
                                >
                                    <td>
                                        <div className="d-flex align-items-center gap-1">
                                            <span className="drag-handle" title="Ziehen zum Sortieren">
                                                <i className="bi bi-grip-vertical" />
                                            </span>
                                            <Button size="sm" variant="outline-secondary" className="px-1"
                                                onClick={() => move(index, -1)} disabled={index === 0}>
                                                <i className="bi bi-chevron-up" />
                                            </Button>
                                            <Button size="sm" variant="outline-secondary" className="px-1"
                                                onClick={() => move(index, 1)} disabled={index === products.length - 1}>
                                                <i className="bi bi-chevron-down" />
                                            </Button>
                                        </div>
                                    </td>
                                    <td className="fw-semibold">
                                        {product.name}
                                        {product.deposit > 0 && <Badge bg="" className="deposit-badge ms-2" title="enthält Pfand">Pfand</Badge>}
                                        {product.deposit < 0 && <Badge bg="" className="deposit-badge ms-2" title="Pfandrückgabe">Rückgabe</Badge>}
                                    </td>
                                    <td className="text-end fw-semibold">{toCurrency(product.price)}</td>
                                    <td className="text-center">{stockLabel(product.stock)}</td>
                                    <td>
                                        <span className={`status-dot ${product.active === 1 ? 'on' : 'off'}`} />
                                        <span className="text-muted small">{product.active === 1 ? 'Aktiv' : 'Inaktiv'}</span>
                                    </td>
                                    <td className="text-end">
                                        <Button size="sm" variant="outline-secondary" className="me-2" onClick={() => openEdit(product)}>
                                            <i className="bi bi-pencil" />
                                        </Button>
                                        {product.active === 1 && (
                                            <Button size="sm" variant="outline-danger" onClick={() => setRemoveTarget(product)}>
                                                <i className="bi bi-bag-x" />
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
                        {editing === 'new' ? 'Produkt hinzufügen' : 'Produkt bearbeiten'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                autoFocus
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Preis</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type="number"
                                    step="0.5"
                                    value={form.price}
                                    onChange={e => setForm({ ...form, price: e.target.value })}
                                />
                                <InputGroup.Text>€</InputGroup.Text>
                            </InputGroup>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Bestand</Form.Label>
                            <Form.Control
                                type="number"
                                min="0"
                                step="1"
                                placeholder="Leer = unbegrenzt"
                                value={form.stock}
                                onChange={e => setForm({ ...form, stock: e.target.value })}
                            />
                            <Form.Text className="text-muted">
                                Leer lassen für unbegrenzten Bestand. Bei 0 ist das Produkt ausverkauft.
                            </Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Pfand</Form.Label>
                            <Form.Control
                                type="number"
                                step="1"
                                value={form.deposit}
                                onChange={e => setForm({ ...form, deposit: e.target.value })}
                            />
                            <Form.Text className="text-muted">
                                1 für Artikel mit Pfand, -1 für die Pfandrückgabe, 0 für alles andere.
                            </Form.Text>
                        </Form.Group>
                        {editing !== 'new' && (
                            <Form.Check
                                type="switch"
                                id="product-active"
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
                        title="Produkt entfernen"
                        text={`Produkt "${removeTarget?.name}" (${toCurrency(removeTarget?.price)}) wirklich entfernen?`}
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
