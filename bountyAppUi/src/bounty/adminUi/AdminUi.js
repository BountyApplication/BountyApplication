import React from 'react';
import {Link} from "react-router-dom";
import AddProduct from './AddProduct';
import AddUser from './AddUser';
import ChangeProduct from './ChangeProduct';
import ChangeUser from './ChangeUser';
import RemoveProduct from './RemoveProduct';
import RemoveUser from './RemoveUser';

export default function AdminUi(props) {

    return(
        <div className="main">
            <Link to="/">{"back"}</Link><br />
            <AddUser />
            <RemoveUser />
            <ChangeUser />
            <AddProduct />
            <RemoveProduct />
            <ChangeProduct />
        </div>
    );
}