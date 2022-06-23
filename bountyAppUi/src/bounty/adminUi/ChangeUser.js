import React, { useState, useEffect } from 'react';
import UserSelect from '../util/UserSelect';
import { changeUser, getUserBalance } from '../util/Database';
import {Form, Button, Collapse} from 'react-bootstrap';
import Input from '../util/Input';

const changeBalance = false;

export default function ChangeUser(props) {
    // vars
    const [user, setUser] = useState(null);
    const [newUser, setNewUser] = useState(null);
    const [balance, setBalance] = useState(null);
    const [newBalance, setNewBalance] = useState(null);

    const [resetCallback, setResetCallback] = useState(null);

    useEffect(() => {
        if(!user) return;
        let b = getUserBalance(user);
        console.log(`${user.firstname} ${user.lastname} (${b}€)`);

        setNewUser(user);
        setBalance(b);
        setNewBalance(b);
    }, [user]);

    function resetAll() {
        setUser(null);
        setNewUser(null);
        setBalance(null);
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
        if(window.confirm(`Change ${user.firstname} ${user.lastname} (${balance}€) to ${newUser.firstname} ${newUser.lastname} (${newBalance}€) ?`)) {
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
                    <Input title="Vorname" value={newUser.firstname} setValue={name => setNewUser({...newUser, firstname: name})} />
                    <Input title="Nachname" value={newUser.lastname} setValue={name => setNewUser({...newUser, lastname: name})} />
                    {changeBalance && <Input type="number" title="Kontostand" value={newBalance} setValue={setNewBalance} />}
                    <Collapse in={(newUser!==user || balance!==newBalance)}>
                        <div>
                            <Button type="reset" variant="secondary" className='ms-2 mb-2' onClick={reset}>{"reset"}</Button>
                            <Button type="submit" className='ms-2 mb-2' onClick={submit}>{"submit"}</Button>
                        </div>
                    </Collapse>
                </Form>
            </div>
        );
    }

    return(
        <div className='rubric'>
            <div className='title'>{"Change User"}</div>
            <UserSelect runCallback={setUser} resetCallback={resetAll} setResetCallback={setResetCallback} useReset={true} hideReset={true}/>
            <Collapse in={newUser}>
                <div>
                    {newUser && changeUserUi()}
                </div>
            </Collapse>
        </div>
    );
}