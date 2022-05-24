import { getLastBookings } from "../util/Database";
import { Accordion, ListGroup } from "react-bootstrap";
import AccordionHeader from "react-bootstrap/esm/AccordionHeader";

export default function LastBookings(props) {
    return(
        <div className="rubric">
            <div className="title">{"Letzte Buchungen"}</div>
            <Accordion>
                {getLastBookings().map(({id, sum, correction, products}) =>
                    <Accordion.Item key={id} eventKey={id}>
                        <Accordion.Header>{`#${id} | Summe: ${sum}€ ${correction ? ` | Korrektur: ${correction>0?"+":""}${(correction.toFixed(2))}€` : ``} `}</Accordion.Header>
                        <Accordion.Collapse eventKey={id}>
                            {products && (<ListGroup>
                                {products.map(({name, price, amount}) =>
                                    <ListGroup.Item key={name}>{`${name} (${price}€): ${amount}`}</ListGroup.Item>
                                )}
                            </ListGroup>)}
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