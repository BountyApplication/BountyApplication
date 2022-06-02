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
    const [amount, setAmount] = useState(1);

    // temp vars
    const tryRemove = remove || !isSufficient;

    // helper function
    const handleProductClick = (id, remove = tryRemove) => {
        const product = products.find(product => product.id === id);
        if(!product) return;
        if(remove && product.amount === 0) return;
        const newAmount = Math.max(product.amount + (remove ? -1 : 1)*amount, 0);
        const updatedProduct = { ...product, amount: newAmount};
        const updatedProducts = products.map(product => product.id===id ? updatedProduct : product)
        setProducts(updatedProducts);
        console.log(remove);
    }

    useEffect(() => {
        document.addEventListener("keydown", checkKey(true));
        document.addEventListener("keyup", checkKey(false));

        return (() => {
            document.removeEventListener("keydown", checkKey(true));
            document.removeEventListener("keyup", checkKey(false));
        });
    }, [])
    
    function checkKey(isPressed) {
        return ({key}) => {
            if(key === "Shift") return setRemove(isPressed);
            if(!isPressed) return;
            if(key === "0") return setAmount(10);
            if(!isNaN(parseFloat(key))) return setAmount(parseFloat(key));
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