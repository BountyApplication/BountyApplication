import React from 'react';
import ProductSelect from '../util/ProductSelect';
import { removeProduct } from '../util/Database';

export default function RemoveProduct() {

    function run(product) {
        if(window.confirm("Remove Product "+product.name+" ("+product.price+"€) ?")) {
            console.log(`Remove Product: ${product.name} (${product.price}€)`);
            removeProduct(product);
        }
    }

    return(
        <div className='rubric'>
            <div className='title'>{"Remove Product"}</div>
            <ProductSelect runCallback={run} useReset={true} useSubmit={true} resetOnSubmit={true} hideReset={true} hideSubmit={true} submitDescription={"remove"} isVertical={true} />
        </div>
    );
}