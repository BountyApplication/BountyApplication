import React, { useState, useEffect } from 'react';
import UserSelect from '../util/CombinedUserSearch';
import { changeUser, useGetUserBalance, removeUser } from '../util/Database';
import {Form, Button, Collapse, Card } from 'react-bootstrap';
import Confirm from '../util/Confirm';
import Input from '../util/Input';
import { toCurrency } from '../util/Util';

const changeBalance = false;

export default function ChangeUser(props) {
    // vars
    const [user, setUser] = useState(null);
    const [newBalance, setNewBalance] = useState(null);
    const balance = useGetUserBalance(user, setNewBalance);
    const [newUser, setNewUser] = useState(null);
    
    const [resetCallback, setResetCallback] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);

    const hasInput = (user !== newUser && newUser != null) || (balance !== newBalance && newBalance != null);

    useEffect(() => {
        if(!user) return;
        
        console.log(`${user.firstname} ${user.lastname} (${balance}€)`);

        setNewUser(user);
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

    function openRemove() {
        if(user == null) return window.alert("Warning: No User selected");
        setShowConfirm(true);
    }

    function remove() {
        console.log(user);
        removeUser(user);
        resetAll();
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
            changeUser(newUser);

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
            {showConfirm ? <Confirm text={`Willst du den User [${user.firstname} ${user.lastname}] wirklich entfernen?`} run={remove} show={showConfirm} setShow={setShowConfirm} /> :
            <Card.Body>
                <UserSelect onlyActive={false} runCallback={setUser} resetCallback={resetAll} setResetCallback={setResetCallback} useReset hideReset hideUserList/>
                <Collapse in={newUser!=null}>
                    <div className='mt-4'>
                        {newUser != null && changeUserUi()}
                    </div>
                </Collapse>
                <div className='d-flex'>
                    {newUser != null && <div className="form-check form-switch  d-flex justify-content-left p-0">
                        <label className="form-check-label fs-5 ms-1" htmlFor="flexSwitchCheckChecked">Aktiv:</label>
                        <input className="form-check-input d-inline float-end ms-2" style={{height: '1.6rem', width: '3.2rem'}} type="checkbox" checked={newUser.active===1} onChange={()=>{setNewUser({...newUser, active: (newUser.active?0:1)});}}></input>
                    </div>}
                    <div className='w-100 d-flex justify-content-end'>
                        <Collapse in={user!=null}>
                            <div>
                                <Button className='bg-danger border-0 d-inline' onClick={openRemove}><i className="bi bi-trash3"></i></Button>
                            </div>
                        </Collapse>
                        <Collapse in={hasInput}>
                            <div>
                                <Button type="reset" className='ms-2' variant="secondary" onClick={reset}>{"reset"}</Button>
                                <Button type="submit" className='ms-2' onClick={submit}>{"submit"}</Button>
                            </div>
                        </Collapse>
                    </div>
                </div>
            </Card.Body>}
        </Card>
        </div>
    );
}