import { useGetLastBookings } from "../util/Database";
import { Card, ListGroup, Col } from "react-bootstrap";
import BookingDisplay from "../util/BookingDisplay";
import { toCurrency } from '../util/Util';
import {useState} from 'react';

export default function LastBookings({userId}) {
    const bookings = useGetLastBookings(userId).sort((booking1, booking2) => booking2.bookingId - booking1.bookingId);
    const [activeBooking, setActiveBooking] = useState(null);
    
    if(bookings==null) return <></>;
    
    return(
        <Card>
            <Card.Header>
                <Card.Title>Letzte Buchungen</Card.Title>
            </Card.Header>
            <Card.Body className='row'>
                <Col>
                    <ListGroup>
                        {bookings.map(({bookingId, date = "0000-00-00 00:00:00", oldBalance, newBalance, total, productSum, correction, cashPayment, products}) =>
                            <ListGroup.Item key={bookingId} eventKey={bookingId} onClick={() => setActiveBooking(bookingId)}>
                                <p className='m-0 me-4'>{`#${bookingId} | ${date.substring(5,16).replace('-', '.')} | Summe: ${toCurrency(productSum)} ${correction ? ` | Korrektur: ${correction>0?'+':''}${toCurrency(correction)}` : ``} ${cashPayment ? ` | Barzahlung: ${cashPayment>0?'+':''}${toCurrency(cashPayment)}` : ``} `}</p>
                            </ListGroup.Item>
                        )}
                    </ListGroup>
                </Col>
                {activeBooking!=null && <Col lg>
                    <BookingDisplay booking={bookings.find(({bookingId}) => bookingId === activeBooking)}/>
                </Col>}
            </Card.Body>
        </Card>
    );
}