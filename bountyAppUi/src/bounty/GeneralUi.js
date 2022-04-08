// import '../App.css';
import React from 'react';
import ProductSelect from './ProductSelect';
import UserSelect from './UserSelect';

export default class GeneralUi extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userId: null,
            userFirstname: "",
            userLastname: "",
            userBalance: null,

            submitCallbac: ()=>{},
        }
    }

    setUserId(id) {
        if(id!==-1) {
            this.setState({userId: id});
            console.log(id);
            this.getUserBalance();
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

    setSubmitCallback(func) {
        this.setState({submitCallbac: func});
    }

    getUserBalance() {
        let balance = 10;
        this.setState({userBalance: balance});
    }

    reset() {
        this.setState({userId: null, userBalance: null, userFirstname: "", userLastname: ""})
    }

    submit() {
        this.state.submitCallbac();
        this.reset();
    }

    render() {
        return(
            <div className="GeneralUi">
                <UserSelect reset={this.reset.bind(this)} setUserId={this.setUserId.bind(this)} setUserFirstname={this.setUserFirstname.bind(this)} setUserLastname={this.setUserLastname.bind(this)} userFirstname={this.state.userFirstname} userLastname={this.state.userLastname} />
                <ProductSelect setSubmitCallback={this.setSubmitCallback.bind(this)} userBalance={this.state.userBalance} />
                <button className="submit" onClick={this.submit}>{"kaufen"}</button>
            </div>
        );
    }
}