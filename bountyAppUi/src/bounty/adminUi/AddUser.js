import React, {useState} from 'react';
import NumberInput from '../util/NumberInput';
import {Form, Button, Collapse, Alert} from 'react-bootstrap';
import { addUser } from '../util/Database';
import TextInput from '../util/TextInput';
import Input from '../util/Input';
import Warning from '../util/Warning';
import Confirm from '../util/Confirm';

export default function Add(props) {
    // vars
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [balance, setBalance] = useState();
    const [showWarning, setShowWarning] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    function reset() {
        setFirstname("");
        setLastname("");
        setBalance(null);
    }

    function submit() {
        if(firstname === "" || lastname === "" || balance === null || isNaN(balance)) {
            console.log("Error no valid entries");
            setShowWarning(true);
            return;
        }
        setShowConfirm(true);   
    }

    function run() {
        console.log(`Add User: ${firstname} ${lastname} (${balance}€)`);
        addUser(firstname, lastname, balance);

        reset();
    }

    return(
        <>
        {showWarning ? <Warning text="No valid entries" show={showWarning} setShow={setShowWarning} /> : null}{
        showConfirm ? <Confirm text={`Willst du den User [${firstname} ${lastname}] mit einem Kontostand von ${balance}€ hinzufügen?`} run={run} show={showConfirm} setShow={setShowConfirm} /> :
        <div className='rubric'>
            <div className='title'>{"Add User"}</div>
            <Form>
                <Input title="Vorname" value={firstname} setValue={setFirstname}/>
                <Input title="Nachname" value={lastname} setValue={setLastname}/>
                <Input type="number" title="Kontostand" value={balance} setValue={setBalance}/>
                <Collapse in={(firstname!=="" || lastname!=="" || balance!=null)}>
                    <Button className="ms-2" variant='secondary' type='reset' onClick={reset}>{"reset"}</Button>
                </Collapse>
                <Collapse in={true||(firstname!=="" && lastname!=="" && balance!=null)}>
                    <Button className="ms-2" variant='primary' type='submit' onClick={submit}>{"submit"}</Button>
                </Collapse>
            </Form>
        </div>}
        </>
    );
}