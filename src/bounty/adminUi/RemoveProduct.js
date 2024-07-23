import React, { useEffect, useState } from 'react';
import ProductSelect from '../util/ProductSelect';
import { removeProduct } from '../util/Database';
import { Card } from 'react-bootstrap';
import Confirm from '../util/Confirm';

export default function RemoveProduct() {
    const [product, setProduct] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        if(!product) return;
        setShowConfirm(true);
    }, [product]);

    function run() {
        // if(window.confirm("Remove Product "+product.name+" ("+product.price+"€) ?")) {
        console.log(`Remove Product: ${product.name} (${product.price}€)`);
        removeProduct(product);
    }

    return(
        <div className='d-flex justify-content-center'>
        <Card className='w-auto mt-3' style={{minWidth: 38+'%'}}>
            <Card.Header>
                <Card.Title>Produkt Entfernen</Card.Title>
            </Card.Header>
            <Card.Body>
                {showConfirm ? <Confirm text={`Willst du das Produkt [${product.name}] wirklich entfernen?`} run={run} show={showConfirm} setShow={setShowConfirm} danger /> :
                <ProductSelect runCallback={setProduct} useReset useSubmit resetOnSubmit hideReset hideSubmit submitDescription={"remove"} isVertical />}
            </Card.Body>
        </Card>
        </div>
    );
}