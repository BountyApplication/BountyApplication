// import '../App.css';
import React from 'react';

export default class Product extends React.Component {
    render() {
        return(
            <button className="Product" onClick={() => this.props.setAmount(this.props.id, this.props.amount+1)}>
                {this.props.name} <br />
                {this.props.price.toFixed(2)+'€'} <br />
                <div style={this.props.amount>0?{color: 'red'}:{}}>{this.props.amount>0 ? this.props.amount : 0}</div>
            </button>
        );
    }
}