import { getLastBookings, useGetLastBookings } from "../util/Database";
import { Card, ListGroup, Col } from "react-bootstrap";
import BookingDisplay from "../util/BookingDisplay";
import { toCurrency } from '../util/Util';
import {useEffect, useState} from 'react';

export default function LastBookings({userId}) {
    const [user, setUser] = useState(null);
    if(user !== userId) setUser(userId);
    // const [bookings, setBookings] = useState(null);
    const bookings = useGetLastBookings(userId);
    /*useEffect(() => {
        if(user==null) return;
        getLastBookings(user, setBookings)
    }, [user]);*/
    const [activeBooking, setActiveBooking] = useState(null);
    
    if(bookings==null) return <></>;

    var count = bookings.length;

    let booking = bookings.find(({bookingId}) => bookingId === activeBooking);

    return(
        <Card>
            <Card.Header>
                <Card.Title>Letzte Buchungen</Card.Title>
            </Card.Header>
            <Card.Body className='row'>
                <Col>
                    <ListGroup>
                        {bookings.length === 0 && 'keine Buchungen'}
                        {bookings.map(({bookingId, date = "0000-00-00 00:00:00", oldBalance, newBalance, total, productSum, correction, cashPayment, products}) =>
                            <ListGroup.Item key={bookingId} eventKey={bookingId} onClick={() => setActiveBooking(bookingId)}>
                                <p className='m-0 me-4 text-start'>{`#${count--} | ${date.substring(5,16).replace('-', '.')} | Summe: ${toCurrency(productSum)} ${correction ? ` | Kor.: ${correction>0?'+':''}${toCurrency(correction)}` : ``} ${cashPayment ? ` | Bar: ${cashPayment>0?'+':''}${toCurrency(cashPayment)}` : ``} `}</p>
                            </ListGroup.Item>
                        )}
                    </ListGroup>
                </Col>
                {activeBooking!==null && booking && <Col lg>
                    <BookingDisplay booking={booking} isHistory={true} userId={userId} />
                </Col>}
            </Card.Body>
        </Card>
    );
}