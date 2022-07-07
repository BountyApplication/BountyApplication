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
        <Card>
            <Card.Header>
                <Card.Title>Produkt Entfernen</Card.Title>
            </Card.Header>
            <Card.Body>
                <ProductSelect runCallback={run} useReset={true} useSubmit={true} resetOnSubmit={true} hideReset={true} hideSubmit={true} submitDescription={"remove"} isVertical={true} />
            </Card.Body>
        </Card>
    );
}