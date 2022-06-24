import React, {useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import {Form, FormControl, InputGroup, FloatingLabel} from 'react-bootstrap';
import { useKeyPress } from './Util';

Input.propTypes = {
    className: PropTypes.string,
    type: PropTypes.string,
    title: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.any,
    setValue: PropTypes.func.isRequired,
    isFocused: PropTypes.bool,
};

Input.defaultProps = {
    className: "m-2",
    type: "text",
    title: "",
    placeholder: null,
    value: null,
    isFocused: false,
    setValue: (v) => {},
};

export default function Input({className, type, title, placeholder, value, setValue, isFocused}) {
    const [focused, setFocused] = useState(false);

    const inputElement = useRef(null);

    useEffect(() => {
        if (inputElement.current) {
            setTimeout(() => {
                inputElement.current.focus();
            }, 0);
        }
    }, []);

    function renderInput() {
        return(
            <FormControl ref={inputElement} type={type==="number"?"number":"text"} placeholder={placeholder==null ?`${title===""?"Betrag":title} eingeben` : placeholder}
                value={ type!=="number" ? value : value == null ? " " : focused?value.toString():value.toFixed(2) }
                onChange={event => {
                    if(type!=="number") return setValue(event.target.value);
                    
                    let newValue = parseFloat(event.target.value);
                    setValue(isNaN(newValue)?null:Math.max(Math.floor(newValue*100+0.01)/100,0));
                }}
                onKeyPress={event => {
                    if(type!=="number") return;
                    if(!/[0-9|,|.]/.test(event.key)) event.preventDefault();
                }}
                onBlur={()=>{setFocused(false);}}
                onFocus={()=>{setFocused(true);}}
            />
        )
    }

    return(
        <Form.Group controlId={title} className={className}>
            {/* { <Form.Label>{title}</Form.Label> } */}
            <InputGroup>
                {title!=="" ? <FloatingLabel className="col" controlId="floatingInput" label={title}>{renderInput()}</FloatingLabel> : renderInput()}
                { type==="number" && <InputGroup.Text className="col-auto">  €</InputGroup.Text> }
            </InputGroup>
        </Form.Group>
    );
}