// import '../App.css';
import React from 'react';

export default class ChangeProduct extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            productName: "",
            productPrice: 0,
        };
    }

    reset() {
        this.setState({
            productName: "",
            productPrice: 0,
        });
    }

    submit() {
        console.log(this.state.productName);
        console.log(this.state.productPrice);
        this.reset();
        // do server
    }

    render() {
        return(
            <div className='ChangeProduct'>
                <p>{"Change Product"}</p>
                {"Select Product: "}
                {"Name: "} <input type="text" value={this.state.productName} onChange={event=>{this.setState({productName: event.target.value})}} />
                {"Price: "} <input type="number" value={this.state.productPrice.toString()} onChange={event=>{this.setState({productPrice: Math.floor(parseFloat(event.target.value)*100)/100})}} onKeyPress={(event)=>{if(!/[0-9|.]/.test(event.key)) event.preventDefault();}} />
                <button className='reset' onClick={this.reset.bind(this)}>{"reset"}</button>
                <button className='submit' onClick={this.submit.bind(this)}>{"submit"}</button>
            </div>
        );
    }
}