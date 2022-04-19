import NumberInput from '../util/NumberInput';

export default function BalanceCorrection(props) {
    return(
        <div className='rubric'>
            <div className='title'>{"Korrekturbuchung"}</div>
            <div className='wrapper'>{"Plus-Korrektur: "} <NumberInput value={props.plus} setValue={props.setPlus} /></div>
            <div className='wrapper'>{"Minus-Korrektur: "} <NumberInput value={props.minus} setValue={props.setMinus} /></div>
        </div>
    );
}