import React from 'react';
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
    tryRemove: PropTypes.bool,
};

ProductDisplay.defaultProps = {
    products: [],
    setProducts: (p) => {},
    tryRemove: false,
};

export default function ProductDisplay({products, setProducts, tryRemove}) {
    const updateProductAmount = (id, amount) => {
        const product = products.find(product => product.id === id);
        if (product) {
            const updatedProduct = { ...product, amount };
            const updatedProducts = products.map(product => product.id===id ? updatedProduct : product)
            setProducts(updatedProducts);
        }
    }
    
    return(
        // <div className="border">
        //     <div className='title'>{"Einkaufen"}</div>
        //     <div className='wrapper'>
        <Card className="m-3">
            <Card.Header><Card.Title className='m-0'>{"Einkaufen"}</Card.Title></Card.Header>
            <Card.Body>
                <Row className="gap-2">
                {products.map(({id, name, price, amount}) => { 
                    return <Product tryRemove={tryRemove} key={id} id={id} name={name} price={price} amount={amount} setAmount={updateProductAmount}/>
                })}
                </Row>
            {/* </div>
        </div> */}
            </Card.Body>
        </Card>
    );

}