import React, { useEffect, useState } from 'react';
import Product from './Product';
import PropTypes from "prop-types";
import { Card, Row } from 'react-bootstrap';
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
    setProducts: (p) => {},
    isSufficient: true,
    availableBalance: 0,
};

export default function ProductDisplay({products, setProducts, isSufficient, availableBalance}) {
    // vars
    // const [shift, setShift] = useState(false);
    const [increment, setIncrement] = useState(1);

    const shift = useKeyPress('Shift');
    // const back = useKeyPress('Back')
    
    // temp vars
    const tryRemove = shift || !isSufficient;

    // helper function
    function handleProductClick(productId, remove = tryRemove) {
        const product = products.find(product => product.productId === productId);
        if(!product) return;
        if(remove && product.amount === 0) return;
        const newAmount = Math.max(product.amount + (remove ? -1 : 1)*increment, 0);
        const updatedProduct = { ...product, amount: newAmount};
        const updatedProducts = products.map(product => product.productId===productId ? updatedProduct : product)
        setProducts(updatedProducts);
        if(increment !== 1) setIncrement(1);
    }

    useEffect(() => {
        document.addEventListener("keydown", checkKey, false);

        return (() => {
            document.removeEventListener("keydown", checkKey, false);
        });
    }, [])

    useKeyPress('Enter', () => setIncrement(1));
        
    function checkKey({key}) {
        if(document.activeElement.className==="form-control") return;
        if(key === 'Delete' || key === "Escape" || key === "Backspace") return setIncrement(1);
        const num = parseFloat(key);
        if(isNaN(num)) return;
        // if(increment === num || (num === 0 && increment === 10)) return;
        if(num === 0) return setIncrement(10);
        setIncrement(Number(num));
    }
    
    return(
        <Card className="m-0 p-0">
            <Card.Header><Card.Title className='mb-0'>{"Einkaufen"}</Card.Title></Card.Header>
            <Card.Body>
                <Row className="gap-2">
                    {products.map(({productId, name, price, amount, active}) => 
                        <Product availableBalance={active?availableBalance:-1} tryRemove={tryRemove} increment={increment} key={productId} productId={productId} name={name} price={price} amount={amount} onClick={handleProductClick}/>
                    )}
                </Row>
            </Card.Body>
        </Card>
    );

}