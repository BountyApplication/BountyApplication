import React, { useEffect, useState } from 'react';
import { Card, Table } from 'react-bootstrap';
import { getLastBookings, useGetUsers } from './Database';
import RowText from './RowText';
import {toCurrency} from './Util';

export default function AccountOverviewUi() {
    const users = useGetUsers();

    const [accounts, setAccounts] = useState(new Map());
    var totalBalance = 0;
    var totalSpent = 0;
    var totalBookings = 0;

    const updateAccounts = (user, bookings) => {
        if(!user) return;
        var _bookings = 0;
        var _spent = 0;
        bookings.forEach(({total}) => {_bookings++; _spent+=total;});
        _spent = Math.round(_spent*100)/100;
        setAccounts(new Map(accounts.set(user, {balance: user.balance, bookings: _bookings, spent: _spent})));
    }

    // compares alphabetic order of two names
    function compareNames(name1, name2) {
        return name1.toLowerCase().localeCompare(name2.toLowerCase());
    }
    
    useEffect(() => {
        setAccounts(new Map());
    }, [users]);

    useEffect(() => {
        if(accounts.size !== 0) return;
        users.map(x=>x).sort((user1, user2) => user1.firstname===user2.firstname? compareNames(user1.lastname, user2.lastname) : compareNames(user1.firstname, user2.firstname)).forEach(user => getLastBookings(user.userId, bookings => updateAccounts(user, bookings)));
    }, [accounts]);

    accounts.forEach(({balance, bookings, spent}) => {totalBalance+=balance; totalBookings+=bookings; totalSpent+=spent;});
    totalBalance = Math.round(totalBalance*100)/100;
    totalSpent = Math.round(totalSpent*100)/100;
    
    return (
        <div className='d-flex justify-content-evenly mt-5'>
            <Card className=''>
                <Card.Header>
                    <Card.Title>Kontostände</Card.Title>
                </Card.Header>
                <Card.Body >
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Vorname</th>
                                <th>Nachname</th>
                                <th>Kontostand</th>
                                <th>Buchungen</th>
                                <th>Geld Ausgegeben</th>
                            </tr>
                            <tr>
                                <th colSpan={2}>Summe</th>
                                <td>{totalBalance}</td>
                                <td>{totalBookings}</td>
                                <td>{totalSpent}</td>
                            </tr>
                        </thead>
                        <tbody>
                            {[...accounts.keys()].map(user => {let {userId, firstname, lastname} = user; let {balance, bookings, spent} = accounts.get(user);
                                return (
                                <tr key={userId}>
                                    <td>{firstname}</td>
                                    <td>{lastname}</td>
                                    <td>{balance}</td>
                                    <td>{bookings}</td>
                                    <td>{spent}</td>
                                </tr>)})}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </div>
    );
}