import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import { getUsers } from './Database';
import { Container, Collapse, Form, Button, Table } from 'react-bootstrap';
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
    resetOnSubmit: PropTypes.bool,   
};

UserSelect.defaultProps = {
    title: "Suchen",
    submitDescription: "submit",

    useReset: false,
    useSubmit: false,

    resetOnSubmit: false,
};

function UserSelect({title, runCallback, resetCallback, setResetCallback, useReset, useSubmit, resetOnSubmit, submitDescription}) {
    // vars
    const [input, setInput] = useState("");
    const [users, setUsers] = useState(getUsers());
    const [user, setUser] = useState(null);

    // temp var for easier access
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
        if(input === '') return true;
        let hasFirstname = checkName(firstname);
        let hasLastname = checkName(lastname);
        let inputsCount = input.split(' ').filter(input => input !== '').length;
        if(inputsCount > 1) return hasFirstname && hasLastname
        return hasFirstname || hasLastname;
    }
    
    function checkName(name) {
        if(input === '') return true;
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
        
        if(runCallback != null) runCallback(user);
        if(resetOnSubmit) reset();
    }

    function reset() {
        setUser(null);
        if(resetCallback != null) resetCallback();
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
            {user!=null && <p>{`${user.firstname} ${user.lastname}`}</p>}
            {useReset   && <Button className="mb-3 mx-2 align-self-end button" variant="secondary" type="reset" onClick={reset}>{"reset"}</Button>}
            {useSubmit  && <Button className="me-2 mb-3 button" variant="primary" type="submit" onClick={submit}>{submitDescription}</Button>}
        </div>
    }
    
    return(
        <Container className="w-25">
            <Collapse in={user == null}>{searchUi()}</Collapse>
            <Collapse in={user != null}>{displayUi()}</Collapse>
        </Container>
    );
}

export default UserSelect;