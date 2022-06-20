import React from 'react';
import PropTypes from 'prop-types';
import {Card, Button, Container,Row, Col, CardTitle } from 'react-bootstrap';

Product.propTypes = {
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    amount: PropTypes.number.isRequired,
    onClick: PropTypes.func.isRequired,
    tryRemove: PropTypes.bool,
};

Product.defaultProps = {
    id: null,
    name: null,
    price: null,
    amount: 0,
    onClick: (v) => {},
    tryRemove: false,
};

export default function Product({id, name, price, amount, onClick, tryRemove, increment, availableBalance}) {
    const disabled = (tryRemove&&amount<increment) || (!tryRemove&&availableBalance < price*increment);
    return(
        <Card className={`w-auto p-0 ${disabled ? 'disabled text-secondary' : ''}`} border={disabled?'secondary':"primary"}>
            <Card.Body className="p-2 pb-1">
                <Card.Title className="fs-6 fw-bold p-0 m-0">{name}</Card.Title>
                
                <Card.Text className='mb-1 mt-0'>{`${price.toFixed(2)}€`}</Card.Text>
                
                <Button className="me-1" variant={disabled?'outline-danger':"outline-secondary"} onClick={onClick.bind(null, id, true)}>{amount}</Button>
                <Button className="" style={{width: '3.5rem'}} variant={disabled?'outline-secondary': "outline-primary"} onClick={onClick.bind(null, id, undefined)} disabled={disabled}>
                    {increment===1 ? (tryRemove?"del.":"add") : ((tryRemove?'-':'+')+increment)}
                </Button>
            </Card.Body>
        </Card>
    );
}