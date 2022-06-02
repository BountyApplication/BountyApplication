import NumberInput from "../util/NumberInput";
import PropTypes from "prop-types";

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
    return(
        <div className="rubric">
            <div className="title">{"Bargeld"}</div>
            <div className="wrapper">{"Bar-Einzahlung: "} <NumberInput value={inVal} setValue={setIn} /></div>
            <div className="wrapper">{"Bar-Auszahlung: "} <NumberInput value={outVal} setValue={setOut} /></div>
        </div>
    );
}