import React, { useEffect, useState } from 'react';
import Product from './Product';
import PropTypes from "prop-types";
import { Card, CardGroup, Row, Col } from 'react-bootstrap';
import CardHeader from 'react-bootstrap/esm/CardHeader';
import { useKeyPress } from '../util/Util';

ProductDisplay.propTypes = {
    products: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number,
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
    setProducts: (p) => {},
    isSufficient: true,
    availableBalance: 0,
};

export default function ProductDisplay({products, setProducts, isSufficient, availableBalance}) {
    // vars
    // const [shift, setShift] = useState(false);
    const [increment, setIncrement] = useState(1);

    const shift = useKeyPress('Shift');
    console.log(shift);

    // temp vars
    const tryRemove = shift || !isSufficient;
    console.log(tryRemove);
    console.log(isSufficient);

    // helper function
    function handleProductClick(id, remove = tryRemove) {
        const product = products.find(product => product.id === id);
        if(!product) return;
        if(remove && product.amount === 0) return;
        const newAmount = Math.max(product.amount + (remove ? -1 : 1)*increment, 0);
        const updatedProduct = { ...product, amount: newAmount};
        const updatedProducts = products.map(product => product.id===id ? updatedProduct : product)
        setProducts(updatedProducts);
        if(increment !== 1) setIncrement(1);
    }

    useEffect(() => {
        document.addEventListener("keydown", checkKey, false);

        return (() => {
            document.removeEventListener("keydown", checkKey, false);
        });
    }, [increment])
    
    function checkKey({key}) {
        const num = parseFloat(key);
        if(isNaN(num)) return;
        if(increment === num || (num === 0 && increment === 10)) return;
        console.log(num);
        if(num === 0) return setIncrement(10);
        setIncrement(Number(num));
    }
    
    return(
        <Card className="m-0 p-0">
            <Card.Header><Card.Title className='mb-0'>{"Einkaufen"}</Card.Title></Card.Header>
            <Card.Body>
                <Row className="gap-2">
                    {products.map(({id, name, price, amount}) => 
                    <Product availableBalance={availableBalance} tryRemove={tryRemove} increment={increment} key={id} id={id} name={name} price={price} amount={amount} onClick={handleProductClick}/>
                )}
                </Row>
            </Card.Body>
        </Card>
    );

}