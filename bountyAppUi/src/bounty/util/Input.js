import React from 'react';
import PropTypes from 'prop-types';
import {Container, Form, FormControl, InputGroup, FloatingLabel} from 'react-bootstrap';

Input.propTypes = {
    className: PropTypes.string,
    type: PropTypes.string,
    title: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.any,
    setValue: PropTypes.func.isRequired,
};

Input.defaultProps = {
    className: "m-2",
    type: "text",
    title: "",
    placeholder: null,
    value: null,
    setValue: (v) => {},
};

export default function Input({className, type, title, placeholder, value, setValue}) {

    return(
        <Form.Group controlId={title} className={className}>
            {/* { <Form.Label>{title}</Form.Label> } */}
            <InputGroup className="">
                <FloatingLabel className="col" controlId="floatingInput" label={title}>
                    <FormControl type={type==="number"?"number":"text"} placeholder={placeholder==null ?`${title} eingeben` : placeholder}
                        value={ type!=="number" ? value : !value ? " " : value.toString() }
                        onChange={event => {
                            if(type!=="number") return setValue(event.target.value);
                            
                            let newValue = parseFloat(event.target.value);
                            setValue(isNaN(newValue)?null:Math.floor(newValue*100+0.01)/100);
                        }}
                        onKeyPress={event => {
                            if(type!=="number") return;
                            if(!/[0-9|.]/.test(event.key)) event.preventDefault();
                        }}
                    />
                </FloatingLabel>
                { type==="number" && <InputGroup.Text className="col-auto">  €</InputGroup.Text> }
            </InputGroup>
        </Form.Group>
    );
}