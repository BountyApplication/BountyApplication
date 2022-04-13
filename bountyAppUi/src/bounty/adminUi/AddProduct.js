// import '../App.css';
import React from 'react';
import NumberInput from '../util/NumberInput';

export default class AddProduct extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            productName: "",
            productPrice: null,
        };
    }

    reset() {
        this.setState({
            productName: "",
            productPrice: null,
        });
    }

    submit() {
        if(this.state.productName === "" || this.state.productPrice === null) {
            console.log("Error no valid entries");
            return;
        }
        console.log(this.state);
        // do server

        this.reset();
    }

    render() {
        return(
            <div className='AddProduct'>
                <p>{"Add Product"}</p>
                {"Name: "} <input value={this.state.productName} onChange={event=>{this.setState({productName: event.target.value})}} />
                {"Price: "} <NumberInput value={this.state.productPrice} setValue={(value)=>{this.setState({productPrice: value});}} />
                <button className='reset' onClick={this.reset.bind(this)}>{"reset"}</button>
                <button className='submit' onClick={this.submit.bind(this)}>{"submit"}</button>
            </div>
        );
    }
}