import {Table} from 'react-bootstrap';

export default function BookingDisplay({className, booking}) {
    var count = 0;
    return(
        <Table striped hover size="sm" className={className}>
            <thead>
                <th>#</th>
                <th>Produkt</th>
                <th>Stück</th>
                <th>Preis</th>
                <th>Summe</th>
            </thead>
            <tbody>
                {booking.map(({name, price, amount}) => 
                    <tr key={name}>
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