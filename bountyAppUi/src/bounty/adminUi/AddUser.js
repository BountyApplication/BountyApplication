import React, {useState} from 'react';
import NumberInput from '../util/NumberInput';
import {Form, Button} from 'react-bootstrap';
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
            <div className='title'>{"Add User"}</div>
            <Form>
                <Input title="Vorname" value={firstname} setValue={setFirstname}/>
                <Input title="Nachname" value={lastname} setValue={setLastname}/>
                <Input type="number" title="Kontostand" value={balance} setValue={setBalance}/>
                {(firstname!=="" || lastname!=="" || balance!=null) && <Button className="ms-2" variant='secondary' type='reset' onClick={reset}>{"reset"}</Button>}
                {(firstname!=="" && lastname!=="" && balance!=null) && <Button className="ms-2" variant='primary' type='submit' onClick={submit}>{"submit"}</Button>}
            </Form>
        </div>
    );
}