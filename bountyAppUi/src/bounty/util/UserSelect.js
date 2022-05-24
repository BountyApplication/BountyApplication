import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import { getUsers } from './Database';
import { Container, Row, Col, Collapse, Form, Button } from 'react-bootstrap';

const debug = true;
const description = false;

const NameType = {
    LASTNAME: false,
    FIRSTNAME: true,
};

function UserSelect({title, runCallback, resetCallback, setResetCallback, useReset, hideReset, useSubmit, hideSubmit, resetOnSubmit}) {
    // vars
    const [users, setUsers] = useState(getUsers());
    const [userFirstname, setUserFirstname] = useState("");
    const [userLastname, setUserLastname] = useState("");

    // temp var for easier access
    const hasFirstname = userFirstname !== "";
    const hasLastname = userLastname !== "";
    const filteredUsers = getFilteredUsers();

    // set callback on beginning
    useEffect(() => {
      if(setResetCallback) setResetCallback(()=>reset);
    }, []);

    // if username input changes, checks for autocomplete or run (if complete)
    useEffect(() => {
        if(hasFirstname && hasLastname) return run();
        checkAutoComplete();
    }, [userFirstname, userLastname]);

    // filters for current selection (firstname or lastname)
    function getFilteredUsers() {
        return users.filter(({lastname, firstname}) => (!hasFirstname || firstname===userFirstname) && (!hasLastname || lastname===userLastname));
    }

    // filters for first user with matching name (no dupplicates)
    function getUniqueUsers(isFirstname) {
        return filteredUsers.filter(({id, firstname, lastname}) => findUser(isFirstname, isFirstname?firstname:lastname).id===id);
    }

    // sortes user selection alphabetically
    function getSortedUsers(isFirstname) {
        return getUniqueUsers(isFirstname).sort((user1, user2) => compareNames(isFirstname?user1.firstname:user1.lastname, isFirstname?user2.firstname:user2.lastname));
    }

    // finds first user with matching name
    function findUser(isFirstname, name) {
        return filteredUsers.find(({firstname, lastname}) => (isFirstname?firstname:lastname)===name);
    }

    // compares alphabetic order of two names
    function compareNames(name1, name2) {
        return name1.toLowerCase().localeCompare(name2.toLowerCase());
    }

    function updateName(isFirstname, name) {
        // resets if name selection deleted
        if(name === "") return reset();

        if(isFirstname)
            setUserFirstname(name);
        else
            setUserLastname(name);
    }
    
    function checkAutoComplete() {
        // returns if autocomplete not possible
        if(filteredUsers.length > 1) return;
        if(!hasFirstname && !hasLastname) return;

        if(!hasFirstname)
            setUserFirstname(findUser(NameType.LASTNAME, userLastname).firstname);
        else
            setUserLastname(findUser(NameType.FIRSTNAME, userFirstname).lastname);            
    }

    // executed when selection complete
    function run() {
        if(debug) console.log(`${userFirstname} ${userLastname}`);

        // auto submit if no submit button
        if(!useSubmit) submit();
    }

    function submit() {
        // checks if result valid
        if(getFilteredUsers().length!==1) {
            console.log(`Error: user selection ambiguous`);
            window.alert(`Error: user selection ambiguous`);
            return;
        }
        
        if(runCallback) runCallback(getFilteredUsers()[0]);
        if(resetOnSubmit) reset();
    }

    function reset() {
        setUserFirstname("");
        setUserLastname("");
        if(resetCallback) resetCallback();
    }

    function nameSelectUi(isFirstname) {
        let userName = isFirstname?userFirstname:userLastname;
        return(
            <Col md><Form.Group controlId={isFirstname?"firstname":"lastname"}>
                {description && <Form.Label>{isFirstname?"Vorname":"Nachname"}</Form.Label>}
                <Form.Select value={userName} onChange={event => updateName(isFirstname, event.target.value)}>
                    <option value="">{userName!==""?"Auswahl löschen":`${isFirstname?"Vorname":"Nachname"} auswählen`}</option>
                    {getSortedUsers(isFirstname).map(({id, firstname, lastname}) => {
                        let name=isFirstname?firstname:lastname;
                        return <option key={id} value={name}>{name}</option>
                    })}
                </Form.Select>
            </Form.Group></Col>
        );
    }
    
    return(
        <Container className="rubric">
            <div className='title'>{title}</div>
            <Form>
                <Row>
                    {nameSelectUi(NameType.FIRSTNAME)}
                    {nameSelectUi(NameType.LASTNAME)}
                    <Collapse in={useReset  && (!hideReset  || hasFirstname || hasLastname)}>
                        <Button className="col-1 m-2" variant="secondary" type="reset" onClick={reset}>{"reset"}</Button>
                    </Collapse>
                    <Collapse in={useSubmit && (!hideSubmit || filteredUsers.length===1)}>
                       <Button className="col-1 m-2" variant="primary" type="submit" onClick={submit}>{"submit"}</Button>
                    </Collapse>
                </Row>
            </Form>
        </Container>
    );
}

UserSelect.prototype = {
    title: PropTypes.string,

    // callbacks
    runCallback: PropTypes.func,
    resetCallback: PropTypes.func,
    setResetCallback: PropTypes.func,

    // settings
    useReset: PropTypes.bool,
    hideReset: PropTypes.bool,
    useSubmit: PropTypes.bool,
    hideSubmit: PropTypes.bool,
    resetOnSubmit: PropTypes.bool,    
};

UserSelect.defaultProps = {
    title: "Suchen",

    useReset: false,
    useSubmit: false,

    hideReset: false,
    hideSubmit: false,

    resetOnSubmit: false,
};

export default UserSelect;