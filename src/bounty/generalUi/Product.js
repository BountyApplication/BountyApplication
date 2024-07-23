import React from 'react';
import PropTypes from 'prop-types';
import {Card, Button} from 'react-bootstrap';
import {useEffect} from 'react';

Product.propTypes = {
    productId: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    amount: PropTypes.number.isRequired,
    onClick: PropTypes.func.isRequired,
    tryRemove: PropTypes.bool,
};

Product.defaultProps = {
    productId: null,
    name: null,
    price: null,
    amount: 0,
    onClick: (v) => {},
    tryRemove: false,
};

export default function Product({productId, name, price, amount, onClick, tryRemove, increment, availableBalance}) {
    const disabled = (tryRemove&&amount<increment) || (!tryRemove&&availableBalance < price*increment);
    
    const title = document.getElementById(productId);

    function resize_to_fit() {
        if(title == null) return;
        while(title.clientHeight > 30) {
            var fontSize = parseInt(window.getComputedStyle(title).fontSize)-1;
            title.style.fontSize = fontSize + 'px';
            if(fontSize <= 14) {
                title.style.textOverflow = 'ellipsis';
                title.className+=" text-truncate";
                break;
            }
            if(fontSize <= 1) break;
        }
        title.style.marginTop = Math.floor((30-title.clientHeight)/2)+'px';
        title.style.marginBottom = Math.ceil((30-title.clientHeight)/2)+'px';
    }

    useEffect(() => {
        setTimeout(() => {
            resize_to_fit();
        }, 0); 
    });

    return(
        <Card className={`p-0 ${disabled ? 'disabled text-secondary' : ''}`} style={{width: '120px'}} border={disabled?'secondary':"primary"}>
            <Card.Body className="p-1">
                <Card.Title className="fw-bold " id={productId}>{name}</Card.Title>
                
                <Card.Text className='mb-1 mt-0'>{`${price.toFixed(2)}€`}</Card.Text>
                
                <Button className="me-1" variant={disabled?'outline-danger':"outline-secondary"} onClick={onClick.bind(null, productId, true)}>{amount}</Button>
                <Button className="" onFocus={()=>{if(document.activeElement.toString() === '[object HTMLButtonElement]') document.activeElement.blur();}} style={{width: '3.5rem'}} variant={disabled?'outline-secondary': "outline-primary"} onClick={onClick.bind(null, productId, undefined)} disabled={disabled}>
                    
                    {increment===1 ? (tryRemove?"del.":"add") : ((tryRemove?'-':'+')+increment)}
                </Button>
            </Card.Body>
        </Card>
    );
}
