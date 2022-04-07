// import '../App.css';
import React from 'react';
import ProductSelect from './ProductSelect';
import UserSelect from './UserSelect';

export default class GeneralUi extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userFirstname: "",
            userLastname: "",
        }
    }

    setUserFirstname(name) {
        this.setState({userFirstname: name});
    }

    setUserLastname(name) {
        this.setState({userLastname: name});
    }

    render() {
        return(
            <div className="GeneralUi">
                <UserSelect userFirstname={this.state.userFirstname} userLastname={this.state.userLastname} setUserFirstname={this.setUserFirstname} setUserLastname={this.setUserLastname} />
                <ProductSelect />
            </div>
        );
    }
}