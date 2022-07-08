import React, { useState, useEffect } from 'react';
import UserSelect from '../util/CombinedUserSearch';
import { changeUser, useGetUserBalance } from '../util/Database';
import {Form, Button, Collapse, Card } from 'react-bootstrap';
import Input from '../util/Input';
import { toCurrency } from '../util/Util';
import { arraysEqual } from '../util/Util';

const changeBalance = false;

export default function ChangeUser(props) {
    // vars
    const [user, setUser] = useState(null);
    const balance = useGetUserBalance(user);
    const [newUser, setNewUser] = useState(null);
    const [newBalance, setNewBalance] = useState(null);

    const [resetCallback, setResetCallback] = useState(null);

    const hasInput = user !== newUser || balance !== newBalance;

    useEffect(() => {
        if(!user) return;
        
        console.log(`${user.firstname} ${user.lastname} (${balance}€)`);

        setNewUser(user);
        setNewBalance(balance);
    }, [user]);

    function resetAll() {
        setUser(null);
        setNewUser(null);
        setNewBalance(null);
    }
    
    function reset() {
        setNewUser(user);
        setNewBalance(balance);
    }

    function submit() {
        if(user===newUser && balance===newBalance) {
            console.log("nothing changed");
            window.alert("Nothing changed");
            return;
        }
        if(newUser.firstname==="" || newUser.lastname==="" || newBalance==null) {
            console.log("Error no valid entries");
            window.alert("Error: No valid entries");
            return;
        }
        if(window.confirm(`Change ${user.firstname} ${user.lastname} (${toCurrency(balance)}) to ${newUser.firstname} ${newUser.lastname} (${toCurrency(newBalance)}) ?`)) {
            console.log(`Change ${user} to ${newUser}`);
            changeUser(user, newUser);

            if(resetCallback)
                resetCallback();
        }
    }

    function changeUserUi() {
        return(
            <div>
                <Form>
                    <Input title="Vorname" value={newUser.firstname} setValue={name => setNewUser({...newUser, firstname: name})} isFocused />
                    <Input title="Nachname" value={newUser.lastname} setValue={name => setNewUser({...newUser, lastname: name})} />
                    {changeBalance && <Input type="number" title="Kontostand" value={newBalance} setValue={setNewBalance} />}
                </Form>
            </div>
        );
    }

    return(
        <div className='d-flex justify-content-center'>
        <Card className='w-25 mt-3 align-self-center'>
            <Card.Header>
                <Card.Title>Benutzer Bearbeiten</Card.Title>
            </Card.Header>
            <Card.Body>
                <UserSelect runCallback={setUser} resetCallback={resetAll} setResetCallback={setResetCallback} useReset hideReset hideUserList/>
                <Collapse in={newUser!=null}>
                    <div className='mt-4'>
                        {newUser != null && changeUserUi()}
                    </div>
                </Collapse>
                <Collapse in={hasInput}>
                    <div >
                        <div className='d-flex justify-content-end mt-3'>
                        <Button type="reset" className='ms-2' variant="secondary" onClick={reset}>{"reset"}</Button>
                        <Button type="submit" className='ms-2' onClick={submit}>{"submit"}</Button>
                        </div>
                    </div>
                </Collapse>
            </Card.Body>
        </Card>
        </div>
    );
}