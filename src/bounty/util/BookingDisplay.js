import React, { useState } from 'react';
import { Table, Collapse, Container, Button, ButtonGroup } from 'react-bootstrap';
import RowText from './RowText';
import { toCurrency } from './Util';
import Confirm from './Confirm';
import { commitBooking, getUserBalance } from './Database';

export function ProductList({ className, products, allProducts, setProducts, isHistory }) {
    function setAmount(productId, next) {
        setProducts(allProducts.map(p => {
            if (p.productId !== productId) return p;
            const hasStock = p.stock !== null && p.stock !== undefined;
            const max = hasStock ? Math.max(p.stock, 0) : Infinity;
            return { ...p, amount: Math.min(Math.max(next, 0), max) };
        }));
    }

    return (
        <Table striped hover size="sm" className={`${className} align-middle`}>
            <thead>
                <tr>
                    <th>Produkt</th>
                    {!isHistory && <th className="text-center">Menge</th>}
                    {isHistory && <th className="text-end">Stück</th>}
                    <th className="text-end">Summe</th>
                    {!isHistory && <th></th>}
                </tr>
            </thead>
            <tbody>
                {products != null && products.map(({ productId, name, price, amount, stock }) => {
                    const stockReached = stock !== null && stock !== undefined && amount >= stock;
                    return (
                        <tr key={productId}>
                            <td className="text-truncate" style={{ maxWidth: '8rem' }} title={name}>{name}</td>
                            {!isHistory ? (
                                <td>
                                    <ButtonGroup size="sm" className="d-flex justify-content-center text-nowrap">
                                        <Button
                                            variant="outline-secondary"
                                            className="px-2 py-0 lh-1"
                                            onClick={() => setAmount(productId, amount - 1)}
                                        >
                                            <i className="bi bi-dash" />
                                        </Button>
                                        <Button variant="outline-secondary" className="px-2 py-0 lh-1 disabled" style={{ minWidth: '2.2rem' }}>
                                            {amount}
                                        </Button>
                                        <Button
                                            variant="outline-secondary"
                                            className="px-2 py-0 lh-1"
                                            disabled={stockReached}
                                            onClick={() => setAmount(productId, amount + 1)}
                                        >
                                            <i className="bi bi-plus" />
                                        </Button>
                                    </ButtonGroup>
                                </td>
                            ) : (
                                <td className="text-end">{amount}</td>
                            )}
                            <td className="text-end text-nowrap">{(price * amount).toFixed(2)} €</td>
                            {!isHistory && (
                                <td className="text-end">
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        className="px-1 py-0 lh-1"
                                        title="Entfernen"
                                        onClick={() => setAmount(productId, 0)}
                                    >
                                        <i className="bi bi-x" />
                                    </Button>
                                </td>
                            )}
                        </tr>
                    );
                })}
            </tbody>
        </Table>
    );
}

export default function BookingDisplay({ children, booking: { oldBalance, newBalance, total, productSum, correction, cashPayment, products }, allProducts, setProducts, isHistory = false, userId = null }) {
    const bold = "fs-5 fw-bold px-0";
    const normal = "fs-5 px-0";
    const hasArticles = Array.isArray(products) && products.some(p => p.amount !== 0);
    const hasInput = (hasArticles || newBalance !== oldBalance || correction !== 0 || cashPayment !== 0);
    const ref = React.createRef();

    const [showConfirm, setShowConfirm] = useState(false);

    function run({ balance }) {
        if (!userId) return;
        const reversedProducts = products.map(p => ({ ...p, amount: -p.amount }));
        const updatedBalance = Math.round((balance + oldBalance - newBalance) * 100) / 100;
        const reversedBooking = {
            oldBalance: balance,
            newBalance: updatedBalance,
            total: -total,
            productSum: -productSum,
            correction: -correction,
            cashPayment: -cashPayment,
            products: reversedProducts,
        };
        commitBooking(userId, reversedBooking);
    }

    if (showConfirm) {
        return (
            <Confirm
                text={`Buchung über ${toCurrency(Math.abs(productSum))} wirklich rückgängig machen?`}
                run={() => getUserBalance(userId, run)}
                show={showConfirm}
                setShow={setShowConfirm}
                danger
            />
        );
    }

    return (
        <Container fluid className="d-flex h-100 align-items-start flex-column px-0">
            <Collapse in={oldBalance != null}>
                <div className="w-100">
                    <RowText ref={ref} className={bold} left={isHistory ? 'Guthaben vorher' : 'Guthaben'} right={toCurrency(oldBalance)} />
                </div>
            </Collapse>

            <Collapse in={products != null && products.length !== 0}>
                <div className="overflow-auto w-100 mt-2">
                    <ProductList
                        products={products?.filter(({ amount }) => amount !== 0)}
                        allProducts={allProducts}
                        setProducts={setProducts}
                        isHistory={isHistory}
                    />
                </div>
            </Collapse>

            <div className="mb-auto" />

            <div className="w-100 mt-2">
                <Collapse in={productSum !== 0}>
                    <div><RowText ref={ref} className={bold} left="Summe" right={toCurrency(productSum)} /></div>
                </Collapse>
                <Collapse in={correction !== 0}>
                    <div><RowText ref={ref} className={normal} left="Korrektur" right={toCurrency(correction)} /></div>
                </Collapse>
                <Collapse in={cashPayment !== 0}>
                    <div><RowText ref={ref} className={normal} left="Barzahlung" right={toCurrency(cashPayment)} /></div>
                </Collapse>
            </div>

            {children}

            <Collapse in={hasInput}>
                <div className="w-100 booking-total-row">
                    <RowText ref={ref} className={bold} left={isHistory ? 'Guthaben nachher' : 'Neu'} right={toCurrency(newBalance)} />
                </div>
            </Collapse>

            {isHistory && userId && (
                <Button
                    variant="outline-danger"
                    size="sm"
                    className="mt-3 w-100"
                    onClick={() => setShowConfirm(true)}
                >
                    <i className="bi bi-arrow-counterclockwise me-1" />
                    Buchung rückgängig machen
                </Button>
            )}
        </Container>
    );
}
