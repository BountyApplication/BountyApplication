import React from 'react';
import PropTypes from 'prop-types';
import {Form, FormControl, InputGroup} from 'react-bootstrap';

TextInput.propTypes = {
    title: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.string.isRequired,
    setValue: PropTypes.func.isRequired,
};

TextInput.defaultProps = {
    title: "",
    placeholder: null,
    value: null,
    setValue: (v) => {},
};

export default function TextInput({title, placeholder, value, setValue}) {
    return(
        <Form.Group className="mb-3" controlId={title}>
            <Form.Label>{title}</Form.Label>
            <InputGroup>
                <FormControl type="text" placeholder={placeholder==null ? `${title} eingeben` : placeholder}
                    value={value}
                    onChange={event => setValue(event.target.value)}
                />
            </InputGroup>
        </Form.Group>
    );
}