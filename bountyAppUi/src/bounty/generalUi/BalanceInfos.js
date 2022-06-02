import PropTypes from 'prop-types';

BalanceInfos.propTypes = {
    balance: PropTypes.number.isRequired,
    sum: PropTypes.number.isRequired,
};

BalanceInfos.defaultProps = {
    balance: null,
    sum: null,
};

export default function BalanceInfos({balance, sum}) {
    return(
        <div className="rubric">
            <div className="title">{"Kontodaten"}</div>
            <div className="wrapper">
            {`Stand: ${balance?`${balance.toFixed(2)}€`:null}`}<br/>
            {`Summe: ${sum?`${sum.toFixed(2)}€`:null}`} <br />
            {`Neu: ${balance&&sum?`${(balance-sum).toFixed(2)}€`:null}`}
            </div>
        </div>
    );
}