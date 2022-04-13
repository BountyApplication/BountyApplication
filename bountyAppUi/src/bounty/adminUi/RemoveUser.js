// import '../App.css';
import React from 'react';
import UserSelect from '../generalUi/UserSelect';

export default class RemoveUser extends React.Component {

    run(user) {
        console.log(user);
        this.setState({user: user});

        // do server
    }

    render() {
        return(
            <div className='RemoveUser'>
                <p>{"Remove User"}</p>
                <UserSelect run={this.run.bind(this)} useReset={true} useSubmit={true} resetSubmit={true} />
            </div>
        );
    }
}