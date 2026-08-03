import React, { useEffect, useState } from 'react';
import Product from './Product';
import PropTypes from "prop-types";
import { Card, Badge } from 'react-bootstrap';
import { useKeyPress } from '../util/Util';

ProductDisplay.propTypes = {
    products: PropTypes.arrayOf(PropTypes.shape({
        productId: PropTypes.number,
        name: PropTypes.string,
        price: PropTypes.number,
        amount: PropTypes.number
    })).isRequired,
    setProducts: PropTypes.func.isRequired,
    isSufficient: PropTypes.bool,
    availableBalance: PropTypes.number,
};

ProductDisplay.defaultProps = {
    products: [],
    setProducts: () => {},
    isSufficient: true,
    availableBalance: 0,
};

export default function ProductDisplay({ products, setProducts, isSufficient, availableBalance }) {
    const [increment, setIncrement] = useState(1);
    const shift = useKeyPress('Shift');
    const tryRemove = shift || !isSufficient;

    function handleProductClick(productId, remove = tryRemove) {
        const product = products.find(p => p.productId === productId);
        if (!product) return;
        if (remove && product.amount === 0) return;
        let newAmount = Math.max(product.amount + (remove ? -1 : 1) * increment, 0);
        const hasStock = product.stock !== null && product.stock !== undefined;
        if (!remove && hasStock) newAmount = Math.min(newAmount, Math.max(product.stock, 0));
        setProducts(products.map(p => p.productId === productId ? { ...p, amount: newAmount } : p));
        if (increment !== 1) setIncrement(1);
    }

    useEffect(() => {
        function checkKey({ key }) {
            if (document.activeElement.className === "form-control") return;
            if (key === 'Delete' || key === 'Escape' || key === 'Backspace') return setIncrement(1);
            const num = parseFloat(key);
            if (isNaN(num)) return;
            setIncrement(num === 0 ? 10 : Number(num));
        }
        document.addEventListener("keydown", checkKey, false);
        return () => document.removeEventListener("keydown", checkKey, false);
    }, []);

    useKeyPress('Enter', () => setIncrement(1));

    const activeProducts = products.filter(({ active }) => active === 1 || active === undefined);
    const inactiveProducts = products.filter(({ active }) => active === 0);

    return (
        <Card className="shadow-sm">
            <Card.Header className="d-flex align-items-center justify-content-between">
                <Card.Title className="mb-0 fw-semibold">Einkaufen</Card.Title>
                <div className="d-flex align-items-center gap-2">
                    {increment !== 1 && (
                        <Badge bg="primary" className="fs-6 px-2">
                            Schritt: {increment}
                        </Badge>
                    )}
                    {tryRemove && (
                        <Badge bg="danger" className="fs-6 px-2">
                            <i className="bi bi-trash3 me-1" />Entfernen
                        </Badge>
                    )}
                </div>
            </Card.Header>
            <Card.Body>
                <div className="product-grid">
                    {activeProducts.map(({ productId, name, price, amount, stock }) =>
                        <Product
                            key={productId}
                            productId={productId}
                            name={name}
                            price={price}
                            amount={amount}
                            stock={stock}
                            availableBalance={availableBalance}
                            tryRemove={tryRemove}
                            increment={increment}
                            onClick={handleProductClick}
                        />
                    )}
                    {inactiveProducts.map(({ productId, name, price, amount }) =>
                        <Product
                            key={productId}
                            productId={productId}
                            name={name}
                            price={price}
                            amount={amount}
                            availableBalance={-1}
                            tryRemove={tryRemove}
                            increment={increment}
                            onClick={handleProductClick}
                        />
                    )}
                </div>
            </Card.Body>
        </Card>
    );
}
