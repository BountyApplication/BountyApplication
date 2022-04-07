// import '../App.css';
import React from 'react';
import Product from './Product'; 

export default class ProductSelect extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            products: [
                { id: 0, name: "Bonbon", price: .05, amount: 0,},
                { id: 1, name: "Schokoriegel", price: .7, amount: 0,},
                { id: 2, name: "Loli", price: .5, amount: 0,},
                { id: 3, name: "Kracher", price: .1, amount: 0,},
                { id: 4, name: "Slush", price: .2, amount: 0,},
                { id: 5, name: "M&M", price: .3, amount: 0,},
                { id: 6, name: "Schlangen", price: .1, amount: 0,},
                { id: 7, name: "Snickers", price: .6, amount: 0,},
                { id: 8, name: "T-shirt", price: 15, amount: 0,},
                { id: 9, name: "Cappy", price: 8, amount: 0,},
                { id: 10, name: "CD", price: 10, amount: 0,},
                { id: 11, name: "Bibel", price: 20, amount: 0,},
                { id: 12, name: "Sprudel", price: 0.8, amount: 0,},
                { id: 13, name: "Apfelschorle", price: 1, amount: 0,},
                { id: 14, name: "Cola", price: 1.5, amount: 0,},
            ]
        }
    }

    updateProductAmount = (id, amount) => {
        const product = this.state.products.find(product => product.id === id);
        if (product) {
            const updatedProduct = { ...product, amount };
            const updatedProducts = [];
            this.state.products.map((product) => {updatedProducts.push(product.id==id?updatedProduct:product);})
            this.setState({ products: updatedProducts });
        }
    }

    submitProducts() {
        const updatedProducts = [];
        this.state.products.map(product => {
            const updatedProduct = {...product, amount: 0 };
            updatedProducts.push(updatedProduct)
        })
        this.setState({ products: updatedProducts });
    }
    
    render() {
        return(
            <div className="ProductSelect">
                {this.state.products.map(({id, name, price, amount}) => { 
                    return <Product key={id} id={id} name={name} price={price} amount={amount} setAmount={this.updateProductAmount}/>
                })}
                <button className="submit" onClick={() => this.submitProducts()}>{"kaufen"}</button>
            </div>
        );
    }


}