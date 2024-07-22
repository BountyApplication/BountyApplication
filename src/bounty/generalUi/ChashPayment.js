import Input from "../util/Input";
import PropTypes from "prop-types";
import { Card, Row, Button } from "react-bootstrap";
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

    function setValue(value) {
        if(value >= 0) if(inMode) return setIn(value); else return setOut(value);
        value = Math.abs(value);
        setInMode(!inMode);
        setOut(inMode?value:0);
        setIn(inMode?0:value);
    }

    return(
        <Card>
            <Card.Header>
                <Card.Title className='m-0'>Guthaben</Card.Title>
            </Card.Header>
            <Card.Body className='px-4'>
                <Row><Input value={inMode?inVal:outVal} setValue={setValue} type="number" className="p-0 mb-3"/></Row>
                <Row>
                    <Button className='col me-3' variant="outline-primary" active={inMode} onClick={()=>{if(inMode) return; setInMode(true);setIn(outVal);setOut(null);}}>Einzahlung</Button>
                    <Button className='col' variant="outline-primary" active={!inMode} onClick={()=>{if(!inMode) return; setInMode(false);setOut(inVal);setIn(null);}}>Auszahlung</Button>
                </Row>
            </Card.Body>
        </Card>
    );
}