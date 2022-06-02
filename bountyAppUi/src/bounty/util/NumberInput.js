import React from 'react';
import PropTypes from 'prop-types';

NumberInput.propTypes = {
    value: PropTypes.number,
    setValue: PropTypes.func.isRequired,
};

NumberInput.defaultProps = {
    value: null,
    setValue: (v) => {},
};

export default function NumberInput({value, setValue}) {
    return(
        <input className='wrapper' type="number"
            value={!value ? " " : value.toString() }
            onChange={event => {
                let newValue = parseFloat(event.target.value);
                setValue(isNaN(newValue)?null:Math.floor(newValue*100+0.01)/100);
            }}
            onKeyPress={event => { if(!/[0-9|.]/.test(event.key)) event.preventDefault(); }}
        />
    );
}