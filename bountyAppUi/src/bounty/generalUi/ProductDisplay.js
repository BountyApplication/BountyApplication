import React from 'react';
import Product from './Product';

export default class ProductDisplay extends React.Component {
    updateProductAmount = (id, amount) => {
        const product = this.props.products.find(product => product.id === id);
        if (product) {
            const updatedProduct = { ...product, amount };
            const updatedProducts = [];
            this.props.products.map((product) => {updatedProducts.push(product.id==id?updatedProduct:product);})
            this.props.setProducts(updatedProducts);
        }
    }
    
    render() {
        return(
            <div className="rubric">
                <div className='title'>{"Einkaufen"}</div>
                <div className='wrapper'>{this.props.products.map(({id, name, price, amount}) => { 
                   return <Product remove={this.props.remove} key={id} id={id} name={name} price={price} amount={amount} setAmount={this.updateProductAmount}/>
                })}</div>
            </div>
        );
    }


}