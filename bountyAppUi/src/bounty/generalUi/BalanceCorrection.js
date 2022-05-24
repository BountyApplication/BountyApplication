import Input from '../util/Input';
import PropTypes from 'prop-types';
import { Card, Row, Col, CardGroup } from 'react-bootstrap';

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
    return(
        <Card className="m-3">
            <Card.Header><Card.Title className="m-0">{"Korrekturbuchung"}</Card.Title></Card.Header>
            <Card.Body className="p-2">
            <Row>
                <Col className="pe-2"><Input type="number" title="Plus-Korrektur" value={plus} setValue={setPlus} /></Col>
                <Col className="ps-2"><Input type="number" title="Minus-Korrektur" value={minus} setValue={setMinus} /></Col>
            </Row>
            </Card.Body>
        </Card>
    );
}