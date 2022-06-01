import {Table} from 'react-bootstrap';

export default function BookingDisplay({booking}) {
    var count = 0;
    return(
        <Table striped hover size="sm" className='m-0'>
            <thead>
                <th>#</th>
                <th>Produkt</th>
                <th>Stück</th>
                <th>Preis</th>
                <th>Summe</th>
            </thead>
            <tbody>
                {booking.map(({name, price, amount}) => 
                    <tr>
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