// import '../App.css';
import React from 'react';
import ProductSelect from './ProductSelect';
import NumberInput from '../util/NumberInput';

export default class ChangeProduct extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            product: null,
            newProduct: null,
            
            resetCallbac: null,
        };
    }

    setProduct(product) {
        console.log(product);
        this.setState({
            product: product,
            newProduct: product,
        });
    }

    setResetCallback(func) {
        this.setState({resetCallbac: func});
    }

    resetAll() {
        this.setState({
            product: null,
            newProduct: null,
        });
    }
    
    reset() {
        this.setState({newProduct: this.state.product});
    }

    submit() {
        if(this.state.product===this.state.newProduct) {
            console.log("nothing changed");
            return;
        }
        if(this.state.newProduct.name==="" || this.state.newProduct.price==null) {
            console.log("Error no valid entries");
            return;
        }
        console.log(this.state.newProduct);
        // do server

        if(this.state.resetCallbac!=null)
            this.state.resetCallbac();
    }

    changeProductUi() {
        return(
            <div>
                {"Name: "} <input value={this.state.newProduct.name} onChange={event=>{this.setState({newProduct: {...this.state.newProduct, name: event.target.value}})}} />
                {"Price: "} <NumberInput value={this.state.newProduct.price} setValue={(value)=>{this.setState({newProduct: {...this.state.newProduct, price: value}})}} />
                <button className='reset' onClick={this.reset.bind(this)}>{"reset"}</button>
                <button className='submit' onClick={this.submit.bind(this)}>{"submit"}</button>
            </div>
        );
    }

    render() {
        return(
            <div className='ChangeProduct'>
                <p>{"Change Product"}</p>
                <ProductSelect run={this.setProduct.bind(this)} reset={this.resetAll.bind(this)} setResetCallback={this.setResetCallback.bind(this)} useReset={true} />
                {this.state.product!=null?this.changeProductUi():null}
            </div>
        );
    }
}