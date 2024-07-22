import React from 'react';
import PropTypes from 'prop-types';
import {Form, FormControl, InputGroup} from 'react-bootstrap';

NumberInput.propTypes = {
    title: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.number,
    setValue: PropTypes.func.isRequired,
};

NumberInput.defaultProps = {
    title: "",
    placeholder: null,
    value: null,
    setValue: (v) => {},
};

export default function NumberInput({title, placeholder, value, setValue}) {

    return(
        <Form.Group className="mb-3" controlId={title}>
            <Form.Label>{title}</Form.Label>
            <InputGroup>
                <FormControl type="number" placeholder={placeholder==null?`${title} eingeben`:placeholder}
                    value={!value ? " " : value.toString() }
                    onChange={event => {
                        let newValue = parseFloat(event.target.value);
                        setValue(isNaN(newValue)?null:Math.floor(newValue*100+0.01)/100);
                    }}
                    onKeyPress={event => { if(!/[0-9|.]/.test(event.key)) event.preventDefault(); }}
                />
                <InputGroup.Text>€</InputGroup.Text>
            </InputGroup>
        </Form.Group>
    );
}