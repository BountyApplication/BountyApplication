
export default function BalanceInfos(props) {
    return(
        <div className='balance infos'>
            <p className='balance'> {"Kontostand: "+(props.balance!=null?props.balance.toFixed(2)+"€":null)} </p>
            <p className='sum'> {"Summe: "+(props.sum!==null?props.sum.toFixed(2)+"€":null)} </p>
            <p className='result'> {"Neu: "+(props.balance!==null&&props.sum!==null?((props.balance-props.sum).toFixed(2)+"€"):null)} </p>
        </div>
    );
}