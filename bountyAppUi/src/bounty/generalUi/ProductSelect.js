// import '../App.css';
import React from 'react';
import Product from './Product'; 

export default class ProductSelect extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            products: this.getProducts(),
            correction: 0,
        }
        this.props.setSubmitCallback(this.submitProducts.bind(this));
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

    calculatePrice() {
        var price = 0;
        for(var i = 0, l = this.state.products.length; i < l; i++)
            price+=this.state.products[i].amount*this.state.products[i].price;
        price+=this.state.correction;
        return price;
    }

    getProducts() {
        // do sever
        return [
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
            { id: 15, name: "Reis", price: 2, amount: 0},
            { id: 16, name: "ESP", price: 5, amount: 0},
        ];
    }

    submitProducts() {
        this.resets();
    }

    reset() {
        const updatedProducts = [];
        this.state.products.map(product => {
            const updatedProduct = {...product, amount: 0 };
            updatedProducts.push(updatedProduct)
        })
        this.setState({ products: updatedProducts, correction: 0 });
    }
    
    render() {
        return(
            <div className="ProductSelect">
                <div className='products'>
                    {this.state.products.map(({id, name, price, amount}) => { 
                        return <Product key={id} id={id} name={name} price={price} amount={amount} setAmount={this.updateProductAmount}/>
                    })}
                </div>
                <div className='correction'>
                    {"Korrektur: "}
                    <input type="number" value={this.state.correction.toString()} onChange={event=>{this.setState({correction: Math.floor(parseFloat(event.target.value)*100)/100})}} onKeyPress={(event)=>{if(!/[0-9|.]/.test(event.key)) event.preventDefault();}} />
                </div>
                <button className='reset' onClick={this.reset.bind(this)}>{"reset"}</button>
                <div className='balance infos'>
                    <p className='balance'> {"Kontostand: "+(this.props.userBalance!=null?this.props.userBalance.toFixed(2)+"€":null)} </p>
                    <p className='sum'> {"Summe: "+this.calculatePrice().toFixed(2)+"€"} </p>
                    <p className='result'> {"Neu: "+(this.props.userBalance!==null?((this.props.userBalance-this.calculatePrice()).toFixed(2)+"€"):null)} </p>
                </div>
            </div>
        );
    }


}