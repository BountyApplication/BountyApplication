// import '../App.css';
import React from 'react';
import UserSelect from '../generalUi/UserSelect';

export default class RemoveUser extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userId: null,
            userFirstname: "",
            userLastname: "",
        }
    }

    setUserId(id) {
        if(id!==-1) {
            this.setState({userId: id});
            console.log(id);
        } else {
            this.reset();
            console.log("Error invalid user select responde");
        }
    }

    setUserFirstname(name, callback) {
        this.setState({userFirstname: name}, callback);
    }

    setUserLastname(name, callback) {
        this.setState({userLastname: name}, callback);
    }

    reset() {
        this.setState({userId: null, userFirstname: "", userLastname: ""})
    }

    submit() {
        this.reset();
        // do server
    }

    render() {
        return(
            <div className='RemoveUser'>
                <p>{"Remove User"}</p>
                {"Select User: "} <UserSelect reset={this.reset.bind(this)} setUserId={this.setUserId.bind(this)} setUserFirstname={this.setUserFirstname.bind(this)} setUserLastname={this.setUserLastname.bind(this)} userFirstname={this.state.userFirstname} userLastname={this.state.userLastname} />
                <button className='submit' onClick={this.submit.bind(this)}>{"delete"}</button>
            </div>
        );
    }
}