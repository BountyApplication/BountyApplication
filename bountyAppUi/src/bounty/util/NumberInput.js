// import '../App.css';
import React from 'react';

export default function NumberInput(props) {
    return(
        <input type="number"
            value={props.value===null?" ":props.value.toString()}
            onChange={event=>{props.setValue(isNaN(parseFloat(event.target.value))?null:Math.floor(parseFloat(event.target.value)*100)/100);}}
            onKeyPress={(event)=>{if(!/[0-9|.]/.test(event.key)) event.preventDefault();}}
        />
    );
}