
export default function BalanceInfos(props) {
    return(
        <div style={{display: "inline-block", border: '1px solid black'}} className='balance infos'>
            {"Kontostand: "+(props.balance!=null?props.balance.toFixed(2)+"€":null)} <br/>
            {"Summe: "+(props.sum!==null?props.sum.toFixed(2)+"€":null)} <br />
            {"Neu: "+(props.balance!==null&&props.sum!==null?((props.balance-props.sum).toFixed(2)+"€"):null)}
        </div>
    );
}