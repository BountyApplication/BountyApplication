import React, {useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import {Form, FormControl, InputGroup, FloatingLabel} from 'react-bootstrap';

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
    className: "my-2",
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
        if(!isFocused) return;
        if(!inputElement.current) return;

        setTimeout(() => {
            inputElement.current.focus();
        }, 0);
    }, [isFocused]);

    function renderInput() {
        return(
            <FormControl className={type==='id'?'p-0 ps-2 fw-bold fs-4 mx-1':''} style={type==='id'?{width: '2.1rem', display: 'inline-block'}:{}} autoComplete='off' autoFocus={isFocused} ref={inputElement} type={type==="number" ? "number":"text"} 
                value={ type!=="number" && type!=="id" ? value : value == null ? '' : focused || type==="id"?value.toString():value.toFixed(2) }
                onChange={event => {
                    if(type!=="number" && type!=="id") return setValue(event.target.value);
                    if(value === 0 && event.target.value === '0.0') return setValue(event.target.value);
                    let newValue = parseFloat(event.target.value);
                    setValue(isNaN(newValue)?null:Math.floor(newValue*100+0.01)/100);
                }}
                onKeyPress={event => {
                    if(type!=="number" && type!=="id") return;
                    if(!/[-,0-9|,|.]/.test(event.key)) event.preventDefault();  
                }}
                onBlur={()=>{setFocused(false);}}
                onFocus={()=>{setFocused(true);}}
            />
        )
    }

    return(
        <Form.Group controlId={title} className={className}>
            {/* { <Form.Label>{title}</Form.Label> } */}
            <InputGroup className={className}>
                {title!=="" ? <FloatingLabel className='col' controlId="floatingInput" label={title}>{renderInput()}</FloatingLabel> : renderInput()}
                {type==="number" && <InputGroup.Text className="col-auto">  €</InputGroup.Text> }
            </InputGroup>
        </Form.Group>
    );
}
