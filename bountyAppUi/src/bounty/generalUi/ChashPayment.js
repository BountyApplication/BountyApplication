import NumberInput from "../util/NumberInput";

export default function CashPayment(props) {
    return(
        <div className="rubric">
            <div className="title">{"Bargeld"}</div>
            <div className="wrapper">{"Bar-Einzahlung: "} <NumberInput value={props.in} setValue={props.setIn} /></div>
            <div className="wrapper">{"Bar-Auszahlung: "} <NumberInput value={props.out} setValue={props.setOut} /></div>
        </div>
    );
}