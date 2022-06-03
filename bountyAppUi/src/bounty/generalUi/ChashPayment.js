import Input from "../util/Input";
import PropTypes from "prop-types";
import { Card, Row, Col, Button } from "react-bootstrap";
import React, {useState} from 'react';

CashPayment.propTypes = {
    inVal: PropTypes.number,
    outVal: PropTypes.number,

    setIn: PropTypes.func.isRequired,
    setOut: PropTypes.func.isRequired,
};

CashPayment.defaultProps = {
    inVal: null,
    outVal: null,

    setIn: (v) => {},
    setOut: (v) => {},
};

export default function CashPayment({inVal, outVal, setIn, setOut}) {
    // vars
    const [inMode, setInMode] = useState(true);

    return(
        <Card>
            <Card.Header>
                <Card.Title className='m-0'>Barzahlung</Card.Title>
            </Card.Header>
            <Card.Body className='px-4'>
                <Row><Input value={inMode?inVal:outVal} setValue={inMode?setIn:setOut} type="number" className="p-0 mb-3"/></Row>
                <Row>
                    <Button className='col me-3' variant="outline-primary" active={inMode} onClick={()=>{setInMode(true);setIn(outVal);setOut(null);}}>Einzahlung</Button>
                    <Button className='col' variant="outline-primary" active={!inMode} onClick={()=>{setInMode(false);setOut(inVal);setIn(null);}}>Auszahlung</Button>
                </Row>
            </Card.Body>
        </Card>
    );
}