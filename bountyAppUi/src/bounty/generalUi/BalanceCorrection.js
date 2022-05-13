import NumberInput from '../util/NumberInput';
import PropTypes from 'prop-types';

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
        <div className='rubric'>
            <div className='title'>{"Korrekturbuchung"}</div>
            <div className='wrapper'><NumberInput title="Plus-Korrektur" value={plus} setValue={setPlus} /></div>
            <div className='wrapper'><NumberInput title="Minus-Korrektur" value={minus} setValue={setMinus} /></div>
        </div>
    );
}