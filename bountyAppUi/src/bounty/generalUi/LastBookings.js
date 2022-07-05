import { useGetLastBookings } from "../util/Database";
import { Accordion } from "react-bootstrap";
import BookingDisplay from "../util/BookingDisplay";
import { toCurrency } from '../util/Util';

export default function LastBookings({userId}) {
    return(
        <div className="rubric">
            <div className="title">{"Letzte Buchungen"}</div>
            <Accordion>
                {useGetLastBookings(userId).sort((booking1, booking2) => booking2.bookingId - booking1.bookingId).map(({bookingId, date = "0000-00-00 00:00:00", oldBalance, newBalance, total, productSum, correction, cashPayment, products}) =>
                    <Accordion.Item key={bookingId} eventKey={bookingId}>
                        <Accordion.Header>
                            <p className='m-0 me-4'>{`#${bookingId} | ${date.substring(5,16).replace('-', '.')} | Summe: ${toCurrency(productSum)} ${correction ? ` | Korrektur: ${correction>0?'+':''}${toCurrency(correction)}` : ``} ${cashPayment ? ` | Barzahlung: ${cashPayment>0?'+':''}${toCurrency(cashPayment)}` : ``} `}</p>
                        </Accordion.Header>
                        <Accordion.Collapse eventKey={bookingId}><>
                            <p className='mx-2 my-2 fw-bold'>{`Alt: ${toCurrency(oldBalance)} | Neu: ${toCurrency(newBalance)} | Summe: ${toCurrency(total)}`}</p>
                            <BookingDisplay className="m-0" products={products}/></>
                        </Accordion.Collapse>
                    </Accordion.Item>
                )}
                <Accordion.Button onClick={()=>{}}>
                    Show more
                </Accordion.Button>
            </Accordion>
        </div>
    );
}