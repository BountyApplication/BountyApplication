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
            <Col xs>
            <Card className="product" border="primary">
                <Card.Body>
                    <Card.Title><h1>{name}</h1></Card.Title>
                    
                        <Card.Text>{`${price.toFixed(2)}€`}</Card.Text>
                    
                        <Container>{amount}
                            <Button className="product" onClick={() => setAmount(id, amount + (tryRemove && amount>0 ? -1 : 1))}>
                                {tryRemove?"remove":"add"}
                            </Button>
                        </Container>
                    
                </Card.Body>
            </Card>
            </Col>
        );
}