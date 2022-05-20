import React, {useState, useEffect} from 'react';
import UserSelect from '../util/UserSelect';
import { removeUser } from '../util/Database';
import Confirm from '../util/Confirm';

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
        <div>
            {showConfirm ? <Confirm text={`Willst du den User [${user.firstname} ${user.lastname}] wirklich entfernen?`} run={run} show={showConfirm} setShow={setShowConfirm} /> :
            <UserSelect title="Remove User" runCallback={setUser} useReset={true} useSubmit={true} resetOnSubmit={true} hideReset={true} hideSubmit={true} />}
        </div>
    );
}