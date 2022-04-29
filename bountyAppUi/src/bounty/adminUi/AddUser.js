// import '../App.css';
import React, {useState} from 'react';
import NumberInput from '../util/NumberInput';
import {Form, FormControl, FormGroup, InputGroup} from 'react-bootstrap';
import { addUser } from '../util/Database';

export default function Add(props) {
    // vars
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [balance, setBalance] = useState(null);

    function reset() {
        setFirstname("");
        setLastname("");
        setBalance(null);
    }

    function submit() {
        if(firstname === "" || lastname === "" || balance === null || isNaN(balance)) {
            console.log("Error no valid entries");
            window.alert("Error: no valid entries");
            return;
        }
        if(window.confirm("Add  "+firstname+" "+lastname+" with a balance of "+balance+"€ ?")) {
            console.log(`Add User: ${firstname} ${lastname} (${balance}€)`);
            addUser(firstname, lastname, balance);

            reset();
        }       
    }

    return(
        <div className='rubric'>
            <div className='title'>{"Add "}</div>
            <Form>
                <FormGroup>
                    <Form.Label>Vorname</Form.Label>
                    <InputGroup>
                        <FormControl type="text" placeholder="Vorname" value={firstname} onChange={event => setFirstname(event.target.value)}/>
                        <InputGroup.Text>€</InputGroup.Text>
                    </InputGroup>
                </FormGroup>
            </Form>
            <div className="wrapper">{"Vorname: "} <input className='wrapper' value={firstname} onChange={event => setFirstname(event.target.value)}/></div>
            <div className="wrapper"> {"Nachname: "} <input className='wrapper' value={lastname} onChange={event => setLastname(event.target.value)} /></div><br className='wrapper' />
            <div className='wrapper'>{"Kontostand: "} <NumberInput value={balance} setValue={setBalance} /></div>
            {(firstname!=="" || lastname!=="" || balance!=null) && <button className="wrapper" onClick={reset}>{"reset"}</button>}
            {(firstname!=="" && lastname!=="" && balance!=null) && <button className='wrapper' onClick={submit}>{"submit"}</button>}
        </div>
    );
}