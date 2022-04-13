import '../../App.css';
import React from 'react';
import {Link} from "react-router-dom";
import ProductDisplay from './ProductDisplay';
import UserSelect from './UserSelect';
import BalanceInfos from './BalanceInfos';
import BalanceCorrection from './BalanceCorrection';

export default class GeneralUi extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: null,
            userBalance: null,
            correction: null,

            products: this.getProducts(),

            resetCallbac: null,
            resetProductsCallback: null,
        }
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

    setUser(user) {
        console.log(user);
        this.setState({user: user})
        this.getUserBalance();
    }

    calculatePrice() {
        var price = 0;
        for(var i = 0, l = this.state.products.length; i < l; i++)
            price+=this.state.products[i].amount*this.state.products[i].price;
        price-=this.state.correction;
        return price;
    }

    getUserBalance() {
        // do server
        let balance = 10;
        this.setState({userBalance: balance});
    }

    reset() {
        this.setState({user: null, userBalance: null, correction: null,});
    }

    resetProducts() {
        const updatedProducts = [];
            this.state.products.map(product => {
                const updatedProduct = {...product, amount: 0 };
                updatedProducts.push(updatedProduct)
            })        
        this.setState({products: updatedProducts});
    }

    submit() {
        console.log(this.calculatePrice());
        // do server
        
        if(this.state.resetCallbac!=null)
            this.state.resetCallbac();
        this.resetProducts();
    }

    render() {
        return(
            <div className="GeneralUi">
                {/* <Link to="/admin">{"Admin"}</Link> */}
                <UserSelect setResetCallback={(func)=>{this.setState({resetCallbac: func});}} reset={this.reset.bind(this)} run={this.setUser.bind(this)} useSubmit={false} />
                <ProductDisplay products={this.state.products} setProducts={(products)=>{this.setState({products: products});}} />
                <BalanceCorrection value={this.state.correction} setValue={(value)=>{this.setState({correction: value});}} />
                <button className='reset' onClick={this.resetProducts.bind(this)}>{"reset"}</button>
                <BalanceInfos balance={this.state.userBalance} sum={this.calculatePrice()} />
                <button className="submit" onClick={this.submit.bind(this)}>{"kaufen"}</button>
            </div>
        );
    }
}