import React from 'react';
import PropTypes from 'prop-types';
import {Form, FormControl, InputGroup, FloatingLabel} from 'react-bootstrap';

Input.propTypes = {
    type: PropTypes.string,
    title: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.any.isRequired,
    setValue: PropTypes.func.isRequired,
};

Input.defaultProps = {
    type: "text",
    title: "",
    placeholder: null,
    value: null,
    setValue: (v) => {},
};

export default function Input({type, title, placeholder, value, setValue}) {

    return(
        <Form.Group className="mb-3" controlId={title}>
            {/* <Form.Label>{title}</Form.Label> */}
            <InputGroup>
            <FloatingLabel
        controlId="floatingInput"
        label={title}
        className="mb-1">
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
                { type==="number" && <InputGroup.Text>€</InputGroup.Text> }
    </FloatingLabel>
            </InputGroup>
        </Form.Group>
    );
}