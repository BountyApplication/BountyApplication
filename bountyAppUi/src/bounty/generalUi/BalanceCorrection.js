import NumberInput from '../util/NumberInput';

export default function BalanceCorrection(props) {
    return(
        <div className='correction'>
            {"Korrektur: "}
            <NumberInput value={props.value} setValue={props.setValue} />
        </div>
    );
}