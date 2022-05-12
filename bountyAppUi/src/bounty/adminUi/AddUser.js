import React, {useState} from 'react';
import NumberInput from '../util/NumberInput';
import {Form} from 'react-bootstrap';
import { addUser } from '../util/Database';
import TextInput from '../util/TextInput';
import Input from '../util/Input';

export default function Add(props) {
    // vars
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [balance, setBalance] = useState();

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
                <Input title="Vorname" value={firstname} setValue={setFirstname}/>
                <Input title="Nachname" value={lastname} setValue={setLastname}/>
                <Input type="number" title="Kontostand" value={balance} setValue={setBalance}/>
            </Form>
            {(firstname!=="" || lastname!=="" || balance!=null) && <button className="wrapper" onClick={reset}>{"reset"}</button>}
            {(firstname!=="" && lastname!=="" && balance!=null) && <button className='wrapper' onClick={submit}>{"submit"}</button>}
        </div>
    );
}