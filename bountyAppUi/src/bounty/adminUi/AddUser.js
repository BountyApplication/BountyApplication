// import '../App.css';
import React from 'react';
import NumberInput from '../util/NumberInput';

export default class AddUser extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userFirstname: "",
            userLastname: "",
            userBalance: null,
        };
    }

    reset() {
        this.setState({userFirstname: "", userLastname: "", userBalance: null});
    }

    submit() {
        if(this.state.userFirstname === "" || this.state.userLastname === "" || this.state.userBalance === null || isNaN(this.state.userBalance)) {
            console.log("Error no valid entries");
            return;
        }
        console.log(this.state);
        // update server

        this.reset();
    }

    render() {
        return(
            <div className='AddUSer'>
                <p>{"Add User"}</p>
                {"Vorname: "} <input value={this.state.userFirstname} onChange={event=>{this.setState({userFirstname: event.target.value})}}/>
                {"Nachname: "} <input value={this.state.userLastname} onChange={event=>{this.setState({userLastname: event.target.value})}} />
                {"Kontostand: "} <NumberInput value={this.state.userBalance} setValue={(value)=>{this.setState({userBalance: value});}} />
                <button className="reset" onClick={this.reset.bind(this)}>{"reset"}</button>
                <button className='submit' onClick={this.submit.bind(this)}>{"submit"}</button>
            </div>
        );
    }
}