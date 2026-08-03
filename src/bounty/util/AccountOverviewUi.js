import React, { useEffect, useState } from 'react';
import { Card, Table } from 'react-bootstrap';
import { getLastBookings, useGetUsers } from './Database';
import { toCurrency } from './Util';
import { Link } from 'react-router-dom';

export default function AccountOverviewUi({ embedded = false }) {
    const users = useGetUsers();
    const [accounts, setAccounts] = useState(new Map());

    function compareNames(a, b) {
        return a.toLowerCase().localeCompare(b.toLowerCase());
    }

    const updateAccounts = (user, bookings) => {
        if (!user) return;
        let count = 0, spent = 0;
        bookings.forEach(({ total }) => { count++; spent += total; });
        spent = Math.round(spent * 100) / 100;
        setAccounts(prev => new Map(prev.set(user, { balance: user.balance, bookings: count, spent })));
    };

    useEffect(() => {
        setAccounts(new Map());
    }, [users]);

    useEffect(() => {
        if (accounts.size !== 0) return;
        [...users]
            .sort((a, b) => a.firstname === b.firstname
                ? compareNames(a.lastname, b.lastname)
                : compareNames(a.firstname, b.firstname))
            .forEach(u => getLastBookings(u.userId, bk => updateAccounts(u, bk)));
    }, [accounts]);

    let totalBalance = 0, totalSpent = 0, totalBookings = 0;
    accounts.forEach(({ balance, bookings, spent }) => {
        totalBalance += balance;
        totalBookings += bookings;
        totalSpent += spent;
    });
    totalBalance = Math.round(totalBalance * 100) / 100;
    totalSpent = Math.round(totalSpent * 100) / 100;

    const table = (
        <Card className="shadow-sm">
                <Card.Body className="p-0">
                    <Table striped hover responsive className="mb-0">
                        <thead>
                            <tr className="table-active">
                                <th>Vorname</th>
                                <th>Nachname</th>
                                <th className="text-end">Kontostand</th>
                                <th className="text-end">Buchungen</th>
                                <th className="text-end">Ausgegeben</th>
                            </tr>
                            <tr className="fw-bold">
                                <td colSpan={2}>Gesamt</td>
                                <td className="text-end">{toCurrency(totalBalance)}</td>
                                <td className="text-end">{totalBookings}</td>
                                <td className="text-end">{toCurrency(totalSpent)}</td>
                            </tr>
                        </thead>
                        <tbody>
                            {[...accounts.keys()].map(user => {
                                const { balance, bookings, spent } = accounts.get(user);
                                return (
                                    <tr key={user.userId}>
                                        <td>{user.firstname}</td>
                                        <td>{user.lastname}</td>
                                        <td className={`text-end fw-semibold ${balance < 0 ? 'text-danger' : ''}`}>
                                            {toCurrency(balance)}
                                        </td>
                                        <td className="text-end">{bookings}</td>
                                        <td className="text-end">{toCurrency(spent)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                </Card.Body>
        </Card>
    );

    if (embedded) return table;

    return (
        <div className="p-3">
            <div className="d-flex align-items-center gap-3 mb-3">
                <Link to="/" className="btn btn-outline-secondary btn-sm">
                    <i className="bi bi-arrow-left me-1" />Zurück
                </Link>
                <h4 className="mb-0 fw-bold">
                    <i className="bi bi-people me-2" />Kontenübersicht
                </h4>
            </div>
            {table}
        </div>
    );
}
