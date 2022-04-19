// import '../App.css';
import React from 'react';
import UserSelect from '../util/UserSelect';

export default class RemoveUser extends React.Component {

    run(user) {
        if(window.confirm("Delete User "+user.firstname+" "+user.lastname+"?")) {
            console.log(user);
            // do server
        }
    }

    render() {
        return(
            <div>
                <UserSelect title="Remove User" run={this.run.bind(this)} useReset={true} useSubmit={true} resetSubmit={true} hideReset={true} hideSubmit={true} />
            </div>
        );
    }
}