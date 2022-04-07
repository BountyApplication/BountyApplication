// import '../App.css';
import React from 'react';

export default class Product extends React.Component {
    render() {
        return(
            <button className="Product" onClick={() => this.props.setAmount(this.props.id, this.props.amount+1)}>
                <ol>{this.props.name}</ol>
                <ol>{this.props.price.toFixed(2)+'€'}</ol>
                <ol style={{color: 'red'}}>{this.props.amount>0 ? this.props.amount : null}</ol>
            </button>
        );
    }
}