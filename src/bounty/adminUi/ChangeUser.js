import React, { useState, useEffect } from 'react';
import UserSelect from '../util/CombinedUserSearch';
import { changeUser, useGetUserBalance, removeUser } from '../util/Database';
import {Form, Button, Collapse, Card } from 'react-bootstrap';
import Confirm from '../util/Confirm';
import Input from '../util/Input';
import Warning from '../util/Warning';

const changeBalance = process.env.REACT_APP_CHANGE_BALANCE === 'true';

export default function ChangeUser(props) {
    // vars
    const [user, setUser] = useState(null);
    const [newBalance, setNewBalance] = useState(null);
    const balance = useGetUserBalance(user, setNewBalance);
    const [newUser, setNewUser] = useState(null);
    
    const [resetCallback, setResetCallback] = useState(null);

    const [showWarning, setShowWarning] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showConfirmRemove, setShowConfirmRemove] = useState(false);

    const hasInput = (user !== newUser && newUser != null) || (balance !== newBalance && newBalance != null);

    useEffect(() => {
        if(!user) return;
        
        console.log(`${user.firstname} ${user.lastname} (${balance}€)`);

        setNewUser(user);
    }, [user, balance]);

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
        // if(user == null) return window.alert("Warning: No User selected");
        if(user === null) return setShowWarning(true);
        setShowConfirmRemove(true);
    }

    function remove() {
        console.log(user);
        removeUser(user);
        resetAll();
    }

    function openChange() {
        if(user===newUser && balance===newBalance) {
            console.log("nothing changed");
            // window.alert("Nothing changed");
            setShowWarning(true);
            return;
        }
        if(newUser.firstname==="" || newUser.lastname==="" || newBalance==null) {
            console.log("Error no valid entries");
            // window.alert("Error: No valid entries");
            setShowWarning(true);
            return;
        }
        newUser.balance = newBalance;
        setShowConfirm(true);  
    }

    function submit() {
        console.log(`Change ${user} to ${newUser}`);
        changeUser(newUser);

        if(resetCallback) resetCallback();
    }
    function changeUserUi() {
        return(
            <div>
                <Form>
                    <Input title="Vorname" value={newUser.firstname} setValue={name => setNewUser({...newUser, firstname: name})} />
                    <Input title="Nachname" value={newUser.lastname} setValue={name => setNewUser({...newUser, lastname: name})} />
                    {changeBalance && <Input type="number" title="Kontostand" value={newBalance} setValue={setNewBalance} />}
                </Form>
            </div>
        );
    }

    return(
        <div className='d-flex justify-content-center'>
        <Card className='w-auto mt-3' style={{minWidth: 38+'%'}}>
            <Card.Header>
                <Card.Title>Benutzer Bearbeiten</Card.Title>
            </Card.Header>
            <Card.Body>
                {showWarning ? <Warning text={user===newUser && balance===newBalance?"Nothing has changed":"No valid entries"} show={showWarning} setShow={setShowWarning} /> :
                 showConfirm ? <Confirm text={`Willst du den User [${user.firstname} ${user.lastname}] mit ${balance}€ zu [${newUser.firstname} ${newUser.lastname}] mit ${newUser.balance}€ ändern?`} run={submit} show={showConfirm} setShow={setShowConfirm} /> :
                 showConfirmRemove ? <Confirm text={`Willst du den User [${user.firstname} ${user.lastname}] mit ${user.balance}€ wirklich entfernen?`} run={remove} show={showConfirmRemove} setShow={setShowConfirmRemove} danger /> :<>
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
                                <Button className='bg-danger border-0 d-inline ms-2' onClick={openRemove}><i className="bi bi-trash3"></i></Button>
                            </div>
                        </Collapse>
                        <Collapse in={hasInput}>
                            <div>
                                <Button type="reset" className='ms-2 mb-2' variant="secondary" onClick={reset}>{"reset"}</Button>
                                <Button type="submit" className='ms-2 mb-2' onClick={openChange}>{"submit"}</Button>
                            </div>
                        </Collapse>
                    </div>
                </div></>}
            </Card.Body>
        </Card>
        </div>
    );
}