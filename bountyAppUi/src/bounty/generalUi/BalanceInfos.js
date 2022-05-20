import PropTypes from 'prop-types';
import { ListGroup } from 'react-bootstrap';

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
        <div className="rubric">
            <div className="title">{"Kontodaten"}</div>
            <ListGroup>
                <ListGroup.Item>{`Stand: ${balance != null? `${balance.toFixed(2)}€` : null}`}</ListGroup.Item>
                <ListGroup.Item>{`Summe: ${sum != null ? `${sum.toFixed(2)}€` : null}`}</ListGroup.Item>
                <ListGroup.Item>{`Neu: ${(balance-sum) != null ? `${(balance-sum).toFixed(2)}€` : null}`}</ListGroup.Item>
            </ListGroup>
        </div>
    );
}