import PropTypes from 'prop-types';
import { Card, ListGroup } from 'react-bootstrap';

BalanceInfos.propTypes = {
    balance: PropTypes.number,
    sum: PropTypes.number,
};

BalanceInfos.defaultProps = {
    balance: null,
    sum: null,
};

export default function BalanceInfos({balance, sum}) {
    return(
        <ListGroup style={{width: 'max-content'}}>
            <ListGroup.Item className="bg-light fw-bold">Kontodaten</ListGroup.Item>
            <ListGroup.Item className="d-flex w-100 justify-content-between">Kontostand<div className='px-1 bg-success text-light rounded'>{balance?`${balance.toFixed(2)}€`:'null'}</div></ListGroup.Item>
            <ListGroup.Item className="d-flex w-100 justify-content-between">Summe Warenkorb<div className='px-1 ms-5 bg-success text-light rounded'>{sum?`${sum.toFixed(2)}€`:'null'}</div></ListGroup.Item>
            <ListGroup.Item className="d-flex w-100 justify-content-between">Kontostand Neu<div className='px-1 bg-success text-light rounded'>{balance&&sum?`${(balance-sum).toFixed(2)}€`:'null'}</div></ListGroup.Item>
        </ListGroup>
    );
}