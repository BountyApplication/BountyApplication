import '../../App.css';
import React from 'react';
import AddProduct from './AddProduct';
import AddUser from './AddUser';
import ChangeProduct from './ChangeProduct';
import RemoveProduct from './RemoveProduct';
import RemoveUser from './RemoveUser';

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
                <AddUser />
                <RemoveUser />
                <AddProduct />
                <RemoveProduct />
                <ChangeProduct />
            </div>
        );
    }
}