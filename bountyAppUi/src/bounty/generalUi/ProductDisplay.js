import React from 'react';
import Product from './Product';

export default function ProductDisplay(props) {
    const updateProductAmount = (id, amount) => {
        const product = props.products.find(product => product.id === id);
        if (product) {
            const updatedProduct = { ...product, amount };
            const updatedProducts = props.products.map(product => {return product.id===id?updatedProduct:product})
            props.setProducts(updatedProducts);
        }
    }
    
    return(
        <div className="rubric">
            <div className='title'>{"Einkaufen"}</div>
            <div className='wrapper'>{props.products.map(({id, name, price, amount}) => { 
                return <Product remove={props.remove} key={id} id={id} name={name} price={price} amount={amount} setAmount={updateProductAmount}/>
            })}</div>
        </div>
    );

}