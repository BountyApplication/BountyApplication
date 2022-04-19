import React from 'react';
import {Link} from "react-router-dom";
import ProductDisplay from './ProductDisplay';
import UserSelect from '../util/UserSelect';
import BalanceInfos from './BalanceInfos';
import BalanceCorrection from './BalanceCorrection';
import CashPayment from './ChashPayment';
import LastBookings from './LastBookings';

export default class GeneralUi extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: null,
            userBalance: null,

            correctionPlus: null,
            correctionMinus: null,
            paymentOut: null,
            paymentIn: null,

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
        this.getUserBalance(user);
    }

    calculatePrice() {
        var price = 0;
        for(var i = 0, l = this.state.products.length; i < l; i++)
            price+=this.state.products[i].amount*this.state.products[i].price;
        price-=this.state.correctionPlus;
        price+=this.state.correctionMinus;
        price-=this.state.paymentIn;
        price+=this.state.paymentOut;
        return price;
    }

    getUserBalance(user) {
        // do server
        let balance = 10;
        this.setState({userBalance: balance});
    }

    reset() {
        this.setState({user: null, userBalance: null});
    }

    resetProducts() {
        const updatedProducts = [];
        this.state.products.map(product => {
            const updatedProduct = {...product, amount: 0 };
            updatedProducts.push(updatedProduct);
        });
        this.setState({products: updatedProducts, correctionPlus: null, correctionMinus: null, paymentIn: null, paymentOut: null,});
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
            <div className="main">
                {/* <Link to="/admin">{"Admin"}</Link> */}
                <UserSelect setResetCallback={(func)=>{this.setState({resetCallbac: func});}} reset={this.reset.bind(this)} run={this.setUser.bind(this)} useSubmit={false} useReset={true} hideReset={true} />
                <ProductDisplay remove={this.calculatePrice()>this.state.userBalance} products={this.state.products} setProducts={(products)=>{this.setState({products: products});}} />
                <BalanceCorrection plus={this.state.correctionPlus} setPlus={(value)=>{this.setState({correctionPlus: value});}} minus={this.state.correctionMinus} setMinus={(value)=>{this.setState({correctionMinus: value})}} />
                <CashPayment out={this.state.paymentOut} setOut={(value)=>{this.setState({paymentOut: value})}} in={this.state.paymentIn} setIn={(value)=>{this.setState({paymentIn: value})}} /><br className='wrapper'/>
                {this.state.user!=null&&<BalanceInfos balance={this.state.userBalance} sum={this.calculatePrice()} />}
                {this.state.user!=null&&<LastBookings />}
                {(this.calculatePrice()!==0||this.state.correction!==null)&&<button className='wrapper' onClick={this.resetProducts.bind(this)}>{"reset"}</button>}
                {this.calculatePrice()<=this.state.userBalance&&(this.calculatePrice()!==0||this.state.correctionPlus!==null||this.state.paymentIn!=null)&&this.state.user!=null&&<button className="wrapper" onClick={this.submit.bind(this)}>{"Buchen"}</button>}
            </div>
        );
    }
}