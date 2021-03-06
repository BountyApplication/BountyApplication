import Input from '../util/Input';
import PropTypes from 'prop-types';
import { Card, Row, Button } from 'react-bootstrap';
import { useState } from 'react';

BalanceCorrection.propTypes = {
    plus: PropTypes.number,
    minus: PropTypes.number,

    setPlus: PropTypes.func.isRequired,
    setMinus: PropTypes.func.isRequired,
};

BalanceCorrection.defaultProps = {
    plus: null,
    minus: null,

    setPlus: (v) => {},
    setMinus: (v) => {},
};

export default function BalanceCorrection({plus, minus, setPlus, setMinus}) {
    // vars
    const [plusMode, setPlusMode] = useState(true);

    function setValue(value) {
        if(value >= 0) if(plusMode) return setPlus(value); else return setMinus(value);
        value = Math.abs(value);
        setPlusMode(!plusMode);
        setPlus(plusMode?0:value);
        setMinus(plusMode?value:0);
    }

    return(
        <Card>
            <Card.Header>
                <Card.Title className='m-0'>Korrektur</Card.Title>
            </Card.Header>
            <Card.Body className='px-4'>
                <Row><Input value={plusMode?plus:minus} setValue={setValue} type="number" className="p-0 mb-3"/></Row>
                <Row>
                    <Button className='col me-3' variant="outline-primary" active={plusMode} onClick={()=>{if(plusMode) return; setPlusMode(true);setPlus(minus);setMinus(null);}}>Plus</Button>
                    <Button className='col' variant="outline-primary" active={!plusMode} onClick={()=>{if(!plusMode) return; setPlusMode(false);setMinus(plus);setPlus(null);}}>Minus</Button>
                </Row>
            </Card.Body>
        </Card>
    );
}