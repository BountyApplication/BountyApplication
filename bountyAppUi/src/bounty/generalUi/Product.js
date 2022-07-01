import React from 'react';
import PropTypes from 'prop-types';
import {Card, Button} from 'react-bootstrap';

Product.propTypes = {
    productId: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    amount: PropTypes.number.isRequired,
    onClick: PropTypes.func.isRequired,
    tryRemove: PropTypes.bool,
};

Product.defaultProps = {
    productId: null,
    name: null,
    price: null,
    amount: 0,
    onClick: (v) => {},
    tryRemove: false,
};

export default function Product({productId, name, price, amount, onClick, tryRemove, increment, availableBalance}) {
    const disabled = (tryRemove&&amount<increment) || (!tryRemove&&availableBalance < price*increment);
    return(
        <Card className={`p-0 ${disabled ? 'disabled text-secondary' : ''}`} style={{width: '120px'}} border={disabled?'secondary':"primary"}>
            <Card.Body className="p-2 pb-1">
                <Card.Title className="fs-6 fw-bold p-1 m-0 overflow-auto text-nowrap">{name}</Card.Title>
                
                <Card.Text className='mb-1 mt-0'>{`${price.toFixed(2)}€`}</Card.Text>
                
                <Button className="me-1" variant={disabled?'outline-danger':"outline-secondary"} onClick={onClick.bind(null, productId, true)}>{amount}</Button>
                <Button className="" style={{width: '3.5rem'}} variant={disabled?'outline-secondary': "outline-primary"} onClick={onClick.bind(null, productId, undefined)} disabled={disabled}>
                    {increment===1 ? (tryRemove?"del.":"add") : ((tryRemove?'-':'+')+increment)}
                </Button>
            </Card.Body>
        </Card>
    );
}