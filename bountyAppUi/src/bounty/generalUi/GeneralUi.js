import React, {useState, useEffect} from 'react';
import {Link} from "react-router-dom";
import ProductDisplay from './ProductDisplay';
import UserSelect from '../util/UserSelect';
import BalanceInfos from './BalanceInfos';
import BalanceCorrection from './BalanceCorrection';
import CashPayment from './ChashPayment';
import LastBookings from './LastBookings';

export default function GeneralUi(props) {
    const [user, setUser] = useState(null);
    const [userBalance, setUserBalance] = useState(null);

    const [correctionPlus, setCorrectionPlus] = useState(null);
    const [correctionMinus, setCorrectionMinus] = useState(null);
    const [paymentIn, setPaymentIn] = useState(null);
    const [paymentOut, setPaymentOut] = useState(null);

    const [products, setProducts] = useState(getProducts(null));
    
    const [resetUserCallback, setResetUserCallback] = useState();
    
    useEffect(() => { getUserBalance(user) }, [user]);

    function getProducts() {
        // do sever
        return [
            { id: 0, name: "Bonbon", price: .05, amount: 0,},
            { id: 1, name: "Schokoriegel", price: .7, amount: 0,},
            { id: 2, name: "Loli", price: .5, amount: 0,},
            { id: 3, name: "Kracher", price: .1, amount: 0,},
            { id: 4, name: "Slush", price: .2, amount: 0,},
            { id: 5, name: "M&M", price: .3, amount: 0,},
            { id: 6, name: "Schlangen", price: .1, amount: 0,},
            { id: 7, name: "Snickers", price: .6, amount: 0,},
            { id: 8, name: "T-shirt", price: 15, amount: 0,},
            { id: 9, name: "Cappy", price: 8, amount: 0,},
            { id: 10, name: "CD", price: 10, amount: 0,},
            { id: 11, name: "Bibel", price: 20, amount: 0,},
            { id: 12, name: "Sprudel", price: 0.8, amount: 0,},
            { id: 13, name: "Apfelschorle", price: 1, amount: 0,},
            { id: 14, name: "Cola", price: 1.5, amount: 0,},
            { id: 15, name: "Reis", price: 2, amount: 0},
            { id: 16, name: "ESP", price: 5, amount: 0},
        ];
    }

    function getUserBalance(user) {
        if(user===null || user===undefined)
            return;
        // do server
        let balance = 10;
        console.log(balance);
        setUserBalance(balance);
    }

    function calculateTotal() {
        const productSum = products.reduce((sum, {price, amount}) => sum+price*amount, 0);
        return productSum - correctionPlus + correctionMinus - paymentIn + paymentOut;
    }

    function resetUser() {
        setUser(null);
        setUserBalance(null);
    }

    function resetProducts() { 
        setProducts(products.map(product => ({...product, amount: 0 })));
        setCorrectionPlus(null);
        setCorrectionMinus(null);
        setPaymentIn(null);
        setPaymentOut(null);
    }

    function submit() {
        console.log(calculateTotal());
        // do server
        
        if(resetUserCallback!=null)
            resetUserCallback();

        resetProducts();
    }

    return(
        <div className="main">
            {/* <Link to="/admin">{"Admin"}</Link> */}
            <UserSelect setResetCallback={setResetUserCallback} reset={resetUser} run={setUser} useSubmit={false} useReset={true} hideReset={true} />
            <ProductDisplay remove={calculateTotal()>userBalance} products={products} setProducts={setProducts} />
            <BalanceCorrection plus={correctionPlus} setPlus={setCorrectionPlus} minus={correctionMinus} setMinus={setCorrectionMinus} />
            <CashPayment out={paymentOut} setOut={setPaymentOut} in={paymentIn} setIn={setPaymentIn} /><br className='wrapper'/>
            {user!==null&&<BalanceInfos balance={userBalance} sum={calculateTotal()} />}
            {user!==null&&<LastBookings />}
            {(calculateTotal()!==0||correctionPlus!==null||paymentIn!==null)&&<button className='wrapper' onClick={resetProducts}>{"reset"}</button>}
            {calculateTotal()<=userBalance&&(calculateTotal()!==0||correctionPlus!==null||paymentIn!=null)&&user!=null&&<button className="wrapper" onClick={submit}>{"Buchen"}</button>}
        </div>
    );
}