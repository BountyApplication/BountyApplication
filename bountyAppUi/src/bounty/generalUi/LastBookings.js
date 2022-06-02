import { getLastBookings } from "../util/Database";

export default function LastBookings(props) {
    return(
        <div className="rubric">
            <div className="title">{"Letzte Buchungen"}</div>
            <div className="wrapper">
                {getLastBookings().map(({id, amount, correction}) => 
                <div key={id}>
                    {`${amount>0 ? '+' : ''}${(amount.toFixed(2))} 
                    ${correction ? ` | cor.: ${correction>0?"+":""}${(correction.toFixed(2))}` : ''}`}
                </div>
                )}
            </div>
        </div>
    );
}