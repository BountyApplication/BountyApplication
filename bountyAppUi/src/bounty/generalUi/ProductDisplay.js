import React, { useEffect, useState } from 'react';
import Product from './Product';
import PropTypes from "prop-types";
import { Card, CardGroup, Row, Col } from 'react-bootstrap';
import CardHeader from 'react-bootstrap/esm/CardHeader';

ProductDisplay.propTypes = {
    products: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        price: PropTypes.number,
        amount: PropTypes.number
    })).isRequired,
    setProducts: PropTypes.func.isRequired,
    isSufficient: PropTypes.bool,
};

ProductDisplay.defaultProps = {
    products: [],
    setProducts: (p) => {},
    isSufficient: true,
};

export default function ProductDisplay({products, setProducts, isSufficient}) {
    // vars
    const [remove, setRemove] = useState(false);

    // temp vars
    const tryRemove = remove || !isSufficient;

    // helper function
    const handleProductClick = (id) => {
        const product = products.find(product => product.id === id);
        if(!product) return;
        if(tryRemove && product.amount === 0) return;
        const newAmount = product.amount + (tryRemove ? -1 : 1);
        const updatedProduct = { ...product, amount: newAmount};
        const updatedProducts = products.map(product => product.id===id ? updatedProduct : product)
        setProducts(updatedProducts);
    }

    useEffect(() => {
        document.addEventListener("keydown", checkRemove(true), false);
        document.addEventListener("keyup", checkRemove(false), false);
    }, [])
    
    function checkRemove(isPressed) {
        return ({key}) => {
            if(key !== "Shift")  return;
                setRemove(isPressed);
        }
    }
    
    return(
        <Card className="m-0 p-0">
            <Card.Header><Card.Title className='mb-0'>{"Einkaufen"}</Card.Title></Card.Header>
            <Card.Body>
                <Row className="gap-2">
                    {products.map(({id, name, price, amount}) => 
                    <Product tryRemove={tryRemove} key={id} id={id} name={name} price={price} amount={amount} onClick={handleProductClick}/>
                )}
                </Row>
            </Card.Body>
        </Card>
    );

}