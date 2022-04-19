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
            window.alert("Error: no valid entries");
            return;
        }
        if(window.confirm("Add Product "+this.state.productName+" ("+this.state.productPrice+"€) ?")) {
            console.log(this.state);
            // do server

            this.reset();
        }
    }

    render() {
        return(
            <div className='rubric'>
                <div className='title'>{"Add Product"}</div>
                <div className='wrapper'>{"Name: "} <input value={this.state.productName} onChange={event=>{this.setState({productName: event.target.value})}} /></div>
                <div className='wrapper'>{"Price: "} <NumberInput value={this.state.productPrice} setValue={(value)=>{this.setState({productPrice: value});}} /></div>
                {(this.state.productName!==""||this.state.productPrice!=null)&&<button className='wrapper' onClick={this.reset.bind(this)}>{"reset"}</button>}
                {(this.state.productName!==""&&this.state.productPrice!=null)&&<button className='wrapper' onClick={this.submit.bind(this)}>{"submit"}</button>}
            </div>
        );
    }
}