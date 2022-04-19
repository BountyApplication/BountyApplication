import React from 'react';
import UserSelect from '../util/UserSelect';
import NumberInput from '../util/NumberInput';

export default class ChangeUser extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: null,
            newUser: null,
            balance: null,
            newBalance: null,
            
            resetCallbac: null,
        };
    }

    setUser(user) {
        console.log(user);
        this.setState({
            user: user,
            newUser: user,
        });
        this.getUserBalance(user);
    }

    getUserBalance(user) {
        // do server
        let balance = 10;
        this.setState({balance: balance, newBalance: balance});
    }

    setResetCallback(func) {
        this.setState({resetCallbac: func});
    }

    resetAll() {
        this.setState({
            user: null,
            newUser: null,
        });
    }
    
    reset() {
        this.setState({newUser: this.state.user, newBalance: this.state.balance});
    }

    submit() {
        if(this.state.user===this.state.newUser&&this.state.balance===this.state.newBalance) {
            console.log("nothing changed");
            window.alert("Nothing changed");
            return;
        }
        if(this.state.newUser.firstname==="" || this.state.newUser.lastname==="" || this.state.newBalance==null) {
            console.log("Error no valid entries");
            window.alert("Error: No valid entries");
            return;
        }
        if(window.confirm("Change "+this.state.user.firstname+" "+this.state.user.lastname+" ("+this.state.balance+"€) to "+this.state.newUser.firstname+" "+this.state.newUser.lastname+" ("+this.state.newBalance+"€) ?")) {
            console.log(this.state.newUser);
            // do server

            if(this.state.resetCallbac!=null)
                this.state.resetCallbac();
        }
    }

    changeUserUi() {
        return(
            <div>
                <div className='wrapper'>{"Vorname: "} <input value={this.state.newUser.firstname} onChange={event=>{this.setState({newUser: {...this.state.newUser, firstname: event.target.value}})}} /></div>
                <div className='wrapper'>{"Nachname: "} <input value={this.state.newUser.lastname} onChange={event=>{this.setState({newUser: {...this.state.newUser, lastname: event.target.value}})}} /></div>
                <div className='wrapper'>{"Kontostand: "} <NumberInput value={this.state.newBalance} setValue={(value)=>{this.setState({newBalance: value})}} /></div>
                {(this.state.newUser!==this.state.user||this.state.balance!==this.state.newBalance)&&<button className='wrapper' onClick={this.reset.bind(this)}>{"reset"}</button>}
                {(this.state.newUser!==this.state.user||this.state.balance!==this.state.newBalance)&&<button className='wrapper' onClick={this.submit.bind(this)}>{"submit"}</button>}
            </div>
        );
    }

    render() {
        return(
            <div className='rubric'>
                <div className='title'>{"Change User"}</div>
                <UserSelect run={this.setUser.bind(this)} reset={this.resetAll.bind(this)} setResetCallback={this.setResetCallback.bind(this)} useReset={true} hideReset={true}/>
                {this.state.user!=null?this.changeUserUi():null}
            </div>
        );
    }
}