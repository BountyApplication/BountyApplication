import React, { useState } from 'react';
import { Table, Collapse, Container, Button, ButtonGroup } from 'react-bootstrap';
import RowText from './RowText';
import { toCurrency } from './Util';
import Confirm from './Confirm';
import { commitBooking, getUserBalance } from './Database';

export function ProductList({ className, products, allProducts, setProducts, isHistory, depositLeft }) {
    function setAmount(productId, next) {
        setProducts(allProducts.map(p => {
            if (p.productId !== productId) return p;
            const hasStock = p.stock !== null && p.stock !== undefined;
            let max = hasStock ? Math.max(p.stock, 0) : Infinity;
            // deposit returns are capped by what the customer still has out
            if (p.deposit < 0) max = Math.min(max, p.amount + Math.max(Math.floor(depositLeft / -p.deposit), 0));
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
                {products != null && products.map(({ productId, name, price, amount, stock, deposit }) => {
                    const stockReached = (stock !== null && stock !== undefined && amount >= stock)
                        || (deposit < 0 && depositLeft < -deposit);
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

export default function BookingDisplay({ children, booking: { oldBalance, newBalance, total, productSum, correction, cashPayment, donation, products, correctionPlus, correctionMinus, paymentIn, paymentOut }, allProducts, setProducts, isHistory = false, userId = null, depositLeft = 0 }) {
    const bold = "fs-5 fw-bold px-0";
    const normal = "fs-5 px-0";
    const hasArticles = Array.isArray(products) && products.some(p => p.amount !== 0);
    // a booking from the history only carries the netted values, the cash view also has the single entries
    const hasDetails = [correctionPlus, correctionMinus, paymentIn, paymentOut].some(v => (v ?? 0) !== 0);
    const hasInput = (hasArticles || hasDetails || newBalance !== oldBalance || correction !== 0 || cashPayment !== 0 || (donation ?? 0) !== 0);
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
            donation: -(donation ?? 0),
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

    const balanceBefore = (
        <Collapse in={oldBalance != null}>
            <div className="w-100">
                <RowText ref={ref} className={bold} left={isHistory ? 'Guthaben vorher' : 'Guthaben'} right={toCurrency(oldBalance)} />
            </div>
        </Collapse>
    );

    const productBlock = (
        <Collapse in={products != null && products.length !== 0}>
            <div className="overflow-auto w-100 mt-2">
                <ProductList
                    products={products?.filter(({ amount }) => amount !== 0)}
                    allProducts={allProducts}
                    setProducts={setProducts}
                    isHistory={isHistory}
                    depositLeft={depositLeft}
                />
            </div>
        </Collapse>
    );

    const totals = (
        <div className="w-100 mt-2">
            <Collapse in={productSum !== 0}>
                <div><RowText ref={ref} className={bold} left="Summe" right={toCurrency(productSum)} /></div>
            </Collapse>
            <Collapse in={(paymentIn ?? 0) !== 0}>
                <div><RowText ref={ref} className={normal} left="Einzahlung" right={toCurrency(paymentIn ?? 0)} /></div>
            </Collapse>
            <Collapse in={(paymentOut ?? 0) !== 0}>
                <div><RowText ref={ref} className={normal} left="Auszahlung" right={toCurrency(-(paymentOut ?? 0))} /></div>
            </Collapse>
            <Collapse in={(correctionPlus ?? 0) !== 0}>
                <div><RowText ref={ref} className={normal} left="Korrektur +" right={toCurrency(correctionPlus ?? 0)} /></div>
            </Collapse>
            <Collapse in={(correctionMinus ?? 0) !== 0}>
                <div><RowText ref={ref} className={normal} left="Korrektur −" right={toCurrency(-(correctionMinus ?? 0))} /></div>
            </Collapse>
            <Collapse in={!hasDetails && correction !== 0}>
                <div><RowText ref={ref} className={normal} left="Korrektur" right={toCurrency(correction)} /></div>
            </Collapse>
            <Collapse in={!hasDetails && cashPayment !== 0}>
                <div><RowText ref={ref} className={normal} left="Barzahlung" right={toCurrency(cashPayment)} /></div>
            </Collapse>
            <Collapse in={(donation ?? 0) !== 0}>
                <div><RowText ref={ref} className={normal} left="Spende" right={toCurrency(-(donation ?? 0))} /></div>
            </Collapse>
        </div>
    );

    const balanceAfter = (
        <Collapse in={hasInput}>
            <div className="w-100 booking-total-row">
                <RowText ref={ref} className={bold} left={isHistory ? 'Guthaben nachher' : 'Neu'} right={toCurrency(newBalance)} />
            </div>
        </Collapse>
    );

    const undoButton = isHistory && userId && (
        <Button
            variant="outline-danger"
            size="sm"
            className="mt-3 w-100"
            onClick={() => setShowConfirm(true)}
        >
            <i className="bi bi-arrow-counterclockwise me-1" />
            Buchung rückgängig machen
        </Button>
    );

    // in the history the summary comes first, a long product list would push it out of sight
    if (isHistory) return (
        <Container fluid className="d-flex h-100 align-items-start flex-column px-0">
            {balanceBefore}
            {totals}
            {balanceAfter}
            {undoButton}
            {productBlock}
        </Container>
    );

    return (
        <Container fluid className="d-flex h-100 align-items-start flex-column px-0">
            {balanceBefore}
            {productBlock}
            <div className="mb-auto" />
            {totals}
            {children}
            {balanceAfter}
        </Container>
    );
}
