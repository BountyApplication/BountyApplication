import React, {useState, useEffect} from 'react';
import UserSelect from '../util/CombinedUserSearch';
import { removeUser } from '../util/Database';
import Confirm from '../util/Confirm';
import { Card } from 'react-bootstrap';

export default function RemoveUser(props) {
    const [user, setUser] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        if(!user) return;
        setShowConfirm(true);
    }, [user]);
    
    function run() {
        console.log(user);
        removeUser(user);
    }

    return(
        <div className='d-flex justify-content-center'>
        <Card className='w-25 mt-3'>
            <Card.Header>
                <Card.Title>Benutzer Entfernen</Card.Title>
            </Card.Header>
            <Card.Body>
                {showConfirm ? <Confirm text={`Willst du den User [${user.firstname} ${user.lastname}] wirklich entfernen?`} run={run} show={showConfirm} setShow={setShowConfirm} /> :
                <UserSelect runCallback={setUser} useReset useSubmit resetOnSubmit hideReset hideSubmit isVertical hideUserList submitDescription={"Entfernen"} />}
            </Card.Body>
        </Card>
        </div>
    );
}