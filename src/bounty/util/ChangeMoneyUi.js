import React from 'react';
import { Card, Table } from 'react-bootstrap';
import { useGetUsers } from './Database';
import { toCurrency } from './Util';
import { Link } from 'react-router-dom';
import { notifyError } from './Notifications';

const DENOMINATIONS = [
    { label: '50,00 €', value: 50 },
    { label: '20,00 €', value: 20 },
    { label: '10,00 €', value: 10 },
    { label:  '5,00 €', value: 5  },
    { label:  '2,00 €', value: 2  },
    { label:  '1,00 €', value: 1  },
    { label:  '0,50 €', value: 0.5   },
    { label:  '0,20 €', value: 0.2   },
    { label:  '0,10 €', value: 0.1   },
    { label:  '0,05 €', value: 0.05  },
    { label:  '0,02 €', value: 0.02  },
    { label:  '0,01 €', value: 0.01  },
];

export default function ChangeMoneyUi({ embedded = false }) {
    const users = useGetUsers();

    let total = 0;
    const counts = new Array(DENOMINATIONS.length).fill(0);

    users.forEach(({ balance }) => {
        total += balance;
        let remaining = Math.round(balance * 100);

        DENOMINATIONS.forEach(({ value }, i) => {
            const cents = Math.round(value * 100);
            const n = Math.floor(remaining / cents);
            counts[i] += n;
            remaining -= n * cents;
        });

        if (remaining !== 0) notifyError(`Fehler bei Wechselgeld-Berechnung! Rest: ${remaining} ct`);
    });

    total = Math.round(total * 100) / 100;

    const card = (
        <Card className="shadow-sm" style={{ maxWidth: '340px' }}>
                <Card.Body className="p-0">
                    <Table hover className="mb-0">
                        <thead>
                            <tr className="table-active">
                                <th>Stückelung</th>
                                <th className="text-end">Anzahl</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="fw-bold">
                                <td>Gesamtsumme</td>
                                <td className="text-end">{toCurrency(total)}</td>
                            </tr>
                            {DENOMINATIONS.map(({ label }, i) => (
                                <tr key={label}>
                                    <td>{label}</td>
                                    <td className="text-end">{counts[i]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
        </Card>
    );

    if (embedded) return card;

    return (
        <div className="p-3">
            <div className="d-flex align-items-center gap-3 mb-3">
                <Link to="/" className="btn btn-outline-secondary btn-sm">
                    <i className="bi bi-arrow-left me-1" />Zurück
                </Link>
                <h4 className="mb-0 fw-bold">
                    <i className="bi bi-cash-stack me-2" />Wechselgeld
                </h4>
            </div>
            {card}
        </div>
    );
}
