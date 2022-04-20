import React from 'react';
// import {Text} from 'react-native';

export default class Product extends React.Component {
    render() {
        return(
            <button className="product" onClick={() => this.props.setAmount(this.props.id, this.props.amount+(this.props.remove&&this.props.amount>0?-1:1))}>
                {/* <Text adjustFontScaling={true} minimumFontScale={0.5}>{this.props.name}</Text> <br /> */}
                {this.props.name} <br />
                {`${this.props.price.toFixed(2)}€`} <br />
                <div style={this.props.amount>0?{color: 'red'}:{}}>{this.props.amount>0 ? this.props.amount : 0}</div>
            </button>
        );
    }
}