// import '../App.css';
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
            <div className="ProductDisplay">
                {this.props.products.map(({id, name, price, amount}) => { 
                   return <Product key={id} id={id} name={name} price={price} amount={amount} setAmount={this.updateProductAmount}/>
                })}
            </div>
        );
    }


}