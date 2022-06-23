import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import { getUsers } from './Database';
import { Modal, Collapse, Form, Button, Table } from 'react-bootstrap';
import Input from './Input';

const debug = true;

UserSelect.prototype = {
    title: PropTypes.string,
    submitDescription: PropTypes.string,

    // callbacks
    runCallback: PropTypes.func,
    resetCallback: PropTypes.func,
    setResetCallback: PropTypes.func,

    // settings
    useReset: PropTypes.bool,
    useSubmit: PropTypes.bool,

    hideReset: PropTypes.bool,
    hideSubmit: PropTypes.bool,
};

UserSelect.defaultProps = {
    title: "Suchen",
    submitDescription: "submit",

    useReset: false,
    useSubmit: false,

    hideReset: false,
    hideSubmit: false,
};

function UserSelect({title, runCallback, resetCallback, setResetCallback, useReset, useSubmit, hideReset, hideSubmit, submitDescription}) {
    // vars
    const [input, setInput] = useState("");
    const [users, setUsers] = useState(getUsers());
    const [user, setUser] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // temp var for easier access
    const hasInput = input !== '';
    const filteredUsers = getFilteredUsers();

    // set callback on beginning
    useEffect(() => {
      if(setResetCallback) setResetCallback(()=>reset);
    }, []);

    // runs if user selected
    useEffect(() => {
        if(user == null) return;
        run();
    }, [user]);

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
        return input.split(" ").some(v => v!=='' && name.includes(v));
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
            console.log(`Error: user selection ambiguous`);
            window.alert(`Error: user selection ambiguous`);
            return;
        }

        setIsSubmitted(true);

        if(runCallback != null) runCallback(user);
    }

    function reset() {
        setInput('');
        setUser(null);
        setIsSubmitted(false);
        if(resetCallback != null && isSubmitted) resetCallback();
    }

    function displayUsers() {
        return <Form className='overflow-auto' style={{height: '30vh'}}>
            <Table striped hover size="sm">
                <thead>
                    <tr>
                        <th>Vorname</th>
                        <th>Nachname</th>
                    </tr>
                </thead>
                <tbody>
                    {getSortedUsers().map(user => 
                        <tr key={user.id} onClick={setUser.bind(this, user)}>
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
            <Input value={input} setValue={setInput} title={"search user"} />
            {displayUsers()}
        </div>
    }

    function displayUi() {
        return <div>
            {user!=null && <div><p className='fs-3 d-inline'>Benutzer: </p><p className='fs-3 d-inline fw-bold'>{`${user.firstname} ${user.lastname}`}</p></div>}
        </div>
    }
    
    return(
        <Modal show={user == null || !isSubmitted}>
            <Modal.Header closeButton>
                <Modal.Title className='fs-2'>User Selection</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Collapse in={user == null}>{searchUi()}</Collapse>
                <Collapse in={user != null}>{displayUi()}</Collapse>
            </Modal.Body>

            <Modal.Footer>
                <Collapse in={useReset  && (!hideReset  || hasInput || user != null)}>
                    <Button variant="secondary" type="reset" onClick={reset}>{"reset"}</Button>
                </Collapse>
                <Collapse in={useSubmit && (!hideSubmit || hasInput || user != null)}>
                    <Button variant="primary" type="submit" onClick={submit}>{submitDescription}</Button>
                </Collapse>
            </Modal.Footer>
        </Modal>
    );
}

export default UserSelect;