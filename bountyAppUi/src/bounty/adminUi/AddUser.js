// import '../App.css';
import React from 'react';

export default class AddUser extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userFirstname: "",
            userLastname: "",
            userBalance: 0,
        };
    }

    reset() {
        this.setState({userFirstname: "", userLastname: "", userBalance: 0});
    }

    submit() {
        console.log(this.state.userFirstname);
        console.log(this.state.userLastname);
        console.log(this.state.userBalance);
        this.reset();
        // update server
    }

    render() {
        return(
            <div className='AddUSer'>
                <p>{"Add User"}</p>
                {"Vorname: "} <input type="text" value={this.state.userFirstname} onChange={event=>{this.setState({userFirstname: event.target.value})}}/>
                {"Nachname: "} <input type="text" value={this.state.userLastname} onChange={event=>{this.setState({userLastname: event.target.value})}} />
                {"Kontostand: "} <input type="number" value={this.state.userBalance.toString()} onChange={event=>{this.setState({userBalance: Math.floor(parseFloat(event.target.value)*100)/100})}} onKeyPress={(event)=>{if(!/[0-9|.]/.test(event.key)) event.preventDefault();}} />
                <button className="reset" onClick={this.reset.bind(this)}>{"reset"}</button>
                <button className='submit' onClick={this.submit.bind(this)}>{"submit"}</button>
            </div>
        );
    }
}