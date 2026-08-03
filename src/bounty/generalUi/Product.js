import React from 'react';
import PropTypes from 'prop-types';
import { Card, Button, Badge } from 'react-bootstrap';

Product.propTypes = {
    productId: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    amount: PropTypes.number.isRequired,
    onClick: PropTypes.func.isRequired,
    tryRemove: PropTypes.bool,
    increment: PropTypes.number,
    availableBalance: PropTypes.number,
    stock: PropTypes.number,
};

Product.defaultProps = {
    tryRemove: false,
    increment: 1,
    availableBalance: 0,
    stock: null,
};

export default function Product({ productId, name, price, amount, onClick, tryRemove, increment, availableBalance, stock }) {
    const hasStock = stock !== null && stock !== undefined;
    const soldOut = hasStock && stock <= 0;
    const stockReached = hasStock && amount >= stock;

    const disabled = soldOut
        || (tryRemove && amount < increment)
        || (!tryRemove && (stockReached || availableBalance < price * increment));
    const hasAmount = amount > 0;

    return (
        <Card
            className={`product-card shadow-sm ${disabled ? 'product-disabled' : ''}`}
            border={hasAmount ? 'primary' : undefined}
        >
            <Card.Body className="p-2 d-flex flex-column gap-1">
                <span className="product-name" title={name}>{name}</span>
                <div className="d-flex align-items-center justify-content-between">
                    <span className={`product-price ${disabled ? 'text-secondary' : 'text-muted'}`}>
                        {price.toFixed(2)} €
                    </span>
                    {soldOut
                        ? <Badge bg="danger">Ausverkauft</Badge>
                        : hasStock && <span className="product-price text-muted">noch {stock - amount}</span>
                    }
                </div>
                <div className="d-flex align-items-center gap-1 mt-1">
                    <Button
                        size="sm"
                        variant={hasAmount ? 'outline-danger' : 'outline-secondary'}
                        className="px-2 py-1"
                        style={{ minWidth: '2.2rem' }}
                        onClick={() => onClick(productId, true)}
                        disabled={!hasAmount}
                        tabIndex={-1}
                    >
                        {hasAmount
                            ? <><i className="bi bi-dash" /> <strong>{amount}</strong></>
                            : '0'
                        }
                    </Button>
                    <Button
                        size="sm"
                        variant={disabled ? 'outline-secondary' : 'outline-primary'}
                        className="flex-grow-1 py-1"
                        onClick={() => onClick(productId, undefined)}
                        disabled={disabled}
                        onFocus={e => e.target.blur()}
                        tabIndex={-1}
                    >
                        {tryRemove
                            ? (increment === 1 ? <i className="bi bi-trash3" /> : <>- {increment}</>)
                            : (increment === 1 ? <><i className="bi bi-plus" /> hinzu</> : <>+ {increment}</>)
                        }
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
}
