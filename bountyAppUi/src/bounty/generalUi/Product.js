import React from 'react';
import PropTypes from 'prop-types';
import {Card, Button, Container,Row, Col, CardTitle } from 'react-bootstrap';

Product.propTypes = {
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    amount: PropTypes.number.isRequired,
    setAmount: PropTypes.func.isRequired,
    tryRemove: PropTypes.bool,
};

Product.defaultProps = {
    id: null,
    name: null,
    price: null,
    amount: 0,
    setAmount: (v) => {},
    tryRemove: false,
};

export default function Product({id, name, price, amount, setAmount, tryRemove}) {
    return(
        <Card className="w-auto p-0" border="primary">
            <Card.Body className="p-2 pb-1">
                <Card.Title className="fs-6 fw-bold p-0 m-0">{name}</Card.Title>
                
                <Card.Text className='mb-1 mt-0'>{`${price.toFixed(2)}€`}</Card.Text>
                
                <p className="d-inline border border-dark rounded px-3 pt-2 pb-2">{amount}</p>
                <Button className="ms-2 mb-1" variant="outline-primary" onClick={() => setAmount(id, amount + (tryRemove && amount>0 ? -1 : 1))}>
                    {tryRemove?"remove":"add"}
                </Button>
            </Card.Body>
        </Card>
    );
}