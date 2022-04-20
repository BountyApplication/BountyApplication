export default function BalanceInfos(props) {
    return(
        <div className="rubric">
            <div className="title">{"Kontodaten"}</div>
            <div className="wrapper">
            {`Stand: ${props.balance!=null?`${props.balance.toFixed(2)}€`:null}`}<br/>
            {`Summe: ${props.sum!==null?`${props.sum.toFixed(2)}€`:null}`} <br />
            {`Neu: ${props.balance!==null&&props.sum!==null?`${(props.balance-props.sum).toFixed(2)}€`:null}`}
            </div>
        </div>
    );
}