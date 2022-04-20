export default function LastBookings(props) {
    return(
        <div className="rubric">
            <div className="title">{"Letzte Buchungen"}</div>
            <div className="wrapper">
                {getLastBookings().map(({id, amount, correction})=>{return <div key={id}>{`${amount>0?'+':''}${(amount.toFixed(2))} ${correction==null?'':` | cor.: ${correction>0?"+":""}${(correction.toFixed(2))}`}`}</div>;})}
            </div>
        </div>
    );
}

function getLastBookings() {
    //do server 
    const bookings = [
        {id: 0, amount: -5.3}, 
        {id: 1, amount: -0.83, correction: +2.1},
        {id: 2, amount: -1.4},
        {id: 3, amount: 5},
    ];
    return bookings;
}