import { useEffect } from 'react';
import {Table} from 'react-bootstrap';

export default function BookingDisplay({className, booking}) {
    var count = 1;
    return(
        <Table striped hover size="sm" className={className+" bookingDisplay"}>
            <thead className='d-sticky'>
                <tr>
                    <th>#</th>
                    <th>Produkt</th>
                    <th>Stück</th>
                    <th>Preis</th>
                    <th>Summe</th>
                </tr>
            </thead>
            <tbody>
                {booking.map(({productId, name, price, amount}) => 
                    <tr key={productId}>
                        <td>{count++}</td>
                        <td>{name}</td>
                        <td>{amount}</td>
                        <td>{`${price.toFixed(2)}€`}</td>
                        <td>{`${(price*amount).toFixed(2)}€`}</td>
                    </tr>
                )}
            </tbody>
        </Table>
    )
}