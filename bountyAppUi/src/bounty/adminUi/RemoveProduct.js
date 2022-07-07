import React from 'react';
import ProductSelect from '../util/ProductSelect';
import { removeProduct } from '../util/Database';
import { Card } from 'react-bootstrap';

export default function RemoveProduct() {

    function run(product) {
        if(window.confirm("Remove Product "+product.name+" ("+product.price+"€) ?")) {
            console.log(`Remove Product: ${product.name} (${product.price}€)`);
            removeProduct(product);
        }
    }

    return(
        <div className='d-flex justify-content-center'>
        <Card className='w-25 mt-3'>
            <Card.Header>
                <Card.Title>Produkt Entfernen</Card.Title>
            </Card.Header>
            <Card.Body>
                <ProductSelect runCallback={run} useReset useSubmit resetOnSubmit hideReset hideSubmit submitDescription={"remove"} isVertical />
            </Card.Body>
        </Card>
        </div>
    );
}