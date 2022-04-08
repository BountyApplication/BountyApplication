// import '../App.css';
import React from 'react';
import UserSelect from './UserSelect';

export default class AdminUi extends React.Component {
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

    render() {
        return(
            <div className="GeneralUi">
                <div className='add User'>
                    <p>{"Add User"}</p>
                    {"Firstname: "} <input type="text" />
                    {"Lastname: "} <input type="text" />
                </div>
                <div className='remove User'>
                    <p>{"Remove User"}</p>
                    {"Select User: "} <UserSelect reset={this.reset.bind(this)} setUserId={this.setUserId.bind(this)} setUserFirstname={this.setUserFirstname.bind(this)} setUserLastname={this.setUserLastname.bind(this)} userFirstname={this.state.userFirstname} userLastname={this.state.userLastname} />
                </div>
                <div className='add Product'>
                    <p>{"Add Product"}</p>
                    {"Name: "} <input type="text" />
                    {"Price: "} <input type="number" />
                </div>
                <div className='remove Product'>
                    <p>{"Remove Product"}</p>
                </div>
            </div>
        );
    }
}