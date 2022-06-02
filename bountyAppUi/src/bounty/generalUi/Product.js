import React from 'react';
import PropTypes from 'prop-types';

Product.propTypes = {
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    amount: PropTypes.number.isRequired,
    setAmount: PropTypes.func.isRequired,
    tryRemove: PropTypes.bool,
};

Product.defaultProps = {
    id: null,
    name: null,
    price: null,
    amount: 0,
    setAmount: (v) => {},
    tryRemove: false,
};

export default function Product({id, name, price, amount, setAmount, tryRemove}) {
        return(
            <button className="product" onClick={() => setAmount(id, amount + (tryRemove && amount>0 ? -1 : 1))}>
                {name} <br />
                {`${price.toFixed(2)}€`} <br />
                <div className={amount>0 ? "redText" : ""}>{amount}</div>
            </button>
        );
}