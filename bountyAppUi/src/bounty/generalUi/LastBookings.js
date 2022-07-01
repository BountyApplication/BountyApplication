import { useGetLastBookings } from "../util/Database";
import { Accordion } from "react-bootstrap";
import BookingDisplay from "../util/BookingDisplay";

export default function LastBookings({userId}) {
    return(
        <div className="rubric">
            <div className="title">{"Letzte Buchungen"}</div>
            <Accordion>
                {useGetLastBookings(userId).map(({bookingId, productSum, correction, cashPayment, products}) =>
                    <Accordion.Item key={bookingId} eventKey={bookingId}>
                        <Accordion.Header>{`#${bookingId} | Summe: ${productSum}€ ${correction ? ` | Korrektur: ${correction>0?"+":"-"}${(correction.toFixed(2))}€` : ``} ${cashPayment ? ` | Barzahlung: ${cashPayment>0?"+":"-"}${(correction.toFixed(2))}€` : ``} `}</Accordion.Header>
                        <Accordion.Collapse eventKey={bookingId}><>
                            <BookingDisplay className="m-0" booking={products}/></>
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