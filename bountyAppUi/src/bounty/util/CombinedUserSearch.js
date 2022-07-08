import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import { useGetUsers } from './Database';
import { Modal, Collapse, Form, Button, Table, Col, Card } from 'react-bootstrap';
import Input from './Input';
import { useKeyPress } from './Util';

const debug = true;
const autoSelection = true;

UserSelect.prototype = {
    title: PropTypes.string,
    submitDescription: PropTypes.string,
    show: PropTypes.bool,
    inModal: PropTypes.bool,

    // callbacks
    setShow: PropTypes.func,
    runCallback: PropTypes.func,
    resetCallback: PropTypes.func,
    setResetCallback: PropTypes.func,

    // settings
    useReset: PropTypes.bool,
    useSubmit: PropTypes.bool,

    hideUserList: PropTypes.bool,
    hideReset: PropTypes.bool,
    hideSubmit: PropTypes.bool,
};

UserSelect.defaultProps = {
    title: "Suchen",
    submitDescription: "Bestätigen",
    show: false,
    inModal: false,

    useReset: false,
    useSubmit: false,

    hideUserList: false,
    hideReset: false,
    hideSubmit: false,
};

function UserSelect({inModal, show, title, setShow, runCallback, resetCallback, setResetCallback, useReset, useSubmit, hideUserList, hideReset, hideSubmit, submitDescription}) {
    // vars
    const [input, setInput] = useState("");
    const users = useGetUsers();
    const [user, setUser] = useState(null);

    // temp var for easier access
    const hasInput = input !== '';
    const filteredUsers = getFilteredUsers();
    const [focus, setFocus] = useState(true);

    useKeyPress('Enter', () => {
        submit();
    });

    useKeyPress('Delete', () => {
        reset();
    });
    
    useKeyPress('Escape', () => {
        if(!show) return;
        // if(user!=null) return reset(); 
        if(setShow!=null) setShow(false);
    });

    useKeyPress('s', () => {
        if(setShow!=null) setShow(true);
    })

    // set callback on beginning
    useEffect(() => {
      if(setResetCallback) setResetCallback(()=>reset);
    }, [setResetCallback]);

    useEffect(() => {
        if(!autoSelection) return;
        if(filteredUsers.length === 1) setUser(filteredUsers[0]);
    }, [filteredUsers])

    // runs if user selected
    useEffect(() => {
        if(user == null) return;
        run();
    }, [user]);

    useEffect(() => {
        if(show) return;
        if(input === '') return;
        setInput('');
    }, [show]);

    function updateInput(newInput) {
        if(input === '' && newInput !== '') reset(true);
        setInput(newInput);
    }

    // filters for current selection (firstname or lastname)
    function getFilteredUsers() {
        return users.filter(({lastname, firstname}) => checkUser(firstname, lastname));
    }

    function checkUser(firstname, lastname) {
        if(!hasInput) return true;
        let hasFirstname = checkName(firstname);
        let hasLastname = checkName(lastname);
        let inputsCount = input.split(' ').filter(input => input !== '').length;
        if(inputsCount > 1) return hasFirstname && hasLastname
        return hasFirstname || hasLastname;
    }
    
    function checkName(name) {
        if(!hasInput) return true;
        return input.toLocaleLowerCase().split(" ").some(v => v!=='' && name.toLocaleLowerCase().includes(v));
    }

    // sortes user selection alphabetically
    function getSortedUsers() {
        let lastnameSelected = filteredUsers.some(({lastname}) => checkName(lastname));
        return filteredUsers.sort((user1, user2) => compareNames(lastnameSelected?user1.firstname:user1.lastname, lastnameSelected?user2.firstname:user2.lastname));
    }

    // compares alphabetic order of two names
    function compareNames(name1, name2) {
        return name1.toLowerCase().localeCompare(name2.toLowerCase());
    }

    // executed when selection complete
    function run() {
        if(debug) console.log(`${user.firstname} ${user.lastname}`);

        // auto submit if no submit button
        if(!useSubmit) submit();
    }

    function submit() {
        // checks if result valid
        if(user == null) {
            console.log(`Error: No User selected!`);
            window.alert(`Error: No User selected!`);
            return;
        }

        if(setShow!=null) setShow(false);

        if(runCallback != null) runCallback(user);
    }

    function reset(keepInput = false) {
        if(!keepInput) {
            setInput("");
            setFocus(false);
            setTimeout(()=>{
                setFocus(true);
            },1);
        }
        setUser(null);
        if(resetCallback != null) resetCallback();
    }

    function displayUsers() {
        return <Form className='overflow-auto mt-3' style={{maxHeight: '30vh'}}>
            <Table striped hover size="sm">
                <thead>
                    <tr>
                        <th>Vorname</th>
                        <th>Nachname</th>
                    </tr>
                </thead>
                <tbody>
                    {getSortedUsers().map(user => 
                        <tr key={user.userId} onClick={setUser.bind(this, user)}>
                            <td>{user.firstname}</td>
                            <td>{user.lastname}</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </Form>
    }

    function searchUi() {
        return <div>
            <Input value={input} setValue={updateInput} title={title} isFocused={focus&&(!inModal||show)} />
        </div>
    }

    function displayUi() {
        return <div>
            {user!=null && <div className='ms-1'><p className='fs-4 d-inline'>Benutzer: </p><p className='fs-4 d-inline fw-bold'>{`${user.firstname} ${user.lastname}`}</p></div>}
        </div>
    }
    
    if(!inModal) return (
        <>
            <Collapse in={true}>{searchUi()}</Collapse>
            <Collapse in={user != null}>{displayUi()}</Collapse>
            <Collapse in={user == null || (hasInput && filteredUsers.length>1) || !hideUserList}>{displayUsers()}</Collapse>
            <div className='d-flex justify-content-end mt-2'>
                <Collapse in={useReset  && (!hideReset  || hasInput || user != null)}>
                    <Button className='ms-2' variant="secondary" type="reset" onClick={reset.bind(this, false)}>Zurücksetzten</Button>
                </Collapse>
                <Collapse in={useSubmit && (!hideSubmit || hasInput || user != null)}>
                    <Button className='ms-2' variant="primary" type="submit" onClick={submit}>{submitDescription}</Button>
                </Collapse>
            </div>
        </>
    );
    
    return(
        <Modal show={show}>
            <Modal.Header closeButton onClick={setShow!=null?setShow.bind(this, false):()=>{}}>
                <Modal.Title className='fs-2'>Benutzer Auswahl</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Collapse in={true}>{searchUi()}</Collapse>
                <Collapse in={user != null}>{displayUi()}</Collapse>
                <Collapse in={user == null || (hasInput && filteredUsers.length>1) || !hideUserList}>{displayUsers()}</Collapse>
            </Modal.Body>

            <Modal.Footer>
                <Collapse in={useReset  && (!hideReset  || hasInput || user != null)}>
                    <Button variant="secondary" type="reset" onClick={reset}>Zurücksetzten</Button>
                </Collapse>
                <Collapse in={useSubmit && (!hideSubmit || hasInput || user != null)}>
                    <Button variant="primary" type="submit" onClick={submit}>{submitDescription}</Button>
                </Collapse>
            </Modal.Footer>
        </Modal>
    );
}

export default UserSelect;