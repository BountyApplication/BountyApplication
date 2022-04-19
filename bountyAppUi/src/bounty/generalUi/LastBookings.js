export default function BalanceInfos(props) {
    return(
        <div className="rubric">
            <div className="title">{"Letzte Buchungen"}</div>
            <div className="wrapper">
                {getLastBookings().map(({amount, correction})=>{return <div>{(amount>0?"+":"")+amount.toFixed(2)+" "+(correction==null?"":" | cor.: "+(correction>0?"+":"")+correction.toFixed(2))}</div>;})}
            </div>
        </div>
    );
}

function getLastBookings() {
    //do server 
    const bookings = [
        {amount: -5.3}, 
        {amount: -0.83, correction: +2.1},
        {amount: -1.4},
        {amount: 5},
    ];
    return bookings;
}