import React from 'react';
import UserSelect from '../util/UserSelect';
import { removeUser } from '../util/Database';

export default function RemoveUser(props) {

    function run(user) {
        if(window.confirm("Delete User "+user.firstname+" "+user.lastname+"?")) {
            console.log(user);
            removeUser(user);
        }
    }

    return(
        <div>
            <UserSelect title="Remove User" runCallback={run} useReset={true} useSubmit={true} resetOnSubmit={true} hideReset={true} hideSubmit={true} />
        </div>
    );
}