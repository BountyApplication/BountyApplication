import React, {useState, useEffect} from 'react';
import {Link} from "react-router-dom";
import ProductDisplay from './ProductDisplay';
import UserSelect from '../util/UserSelect';
import BalanceInfos from './BalanceInfos';
import BalanceCorrection from './BalanceCorrection';
import CashPayment from './ChashPayment';
import LastBookings from './LastBookings';
import { getProducts, getUserBalance, commitBooking } from '../util/Database';
// import BarcodeScannerComponent from "react-qr-barcode-scanner";
import Html5QrcodePlugin from '../util/scanner';

const debug = true;

export default function GeneralUi({showAdminLink = false}) {
    // vars
    const [user, setUser] = useState();
    const [userBalance, setUserBalance] = useState();

    const [correctionPlus, setCorrectionPlus] = useState(null);
    const [correctionMinus, setCorrectionMinus] = useState(null);
    const [paymentIn, setPaymentIn] = useState(null);
    const [paymentOut, setPaymentOut] = useState(null);

    const [products, setProducts] = useState(getProducts());
    
    const [resetUserCallback, setResetUserCallback] = useState();

    const [data, setData] = useState('No result');

    // temp vars for easier access
    const total = calculateTotal();
    const isSufficient = total<=userBalance;
    const hasInput = (total!==0 || correctionPlus || paymentIn);

    // executes in beginning
    useEffect(() => {
        
    }, []);
    
    // get user balance when user gets selected
    useEffect(() => {
        if(!user) return;
        
        let balance = getUserBalance(user.id);
        if(debug) console.log(`Balance: ${balance}`);
        setUserBalance(balance);
    }, [user]);

    function calculateTotal() {
        const productSum = products.reduce((sum, {price, amount}) => sum+price*amount, 0);
        return productSum - correctionPlus + correctionMinus - paymentIn + paymentOut;
    }

    function resetUser() {
        setUser(null);
        setUserBalance(null);
    }

    function resetProducts() { 
        setProducts(products.map(product => ({...product, amount: 0})));
        setCorrectionPlus(null);
        setCorrectionMinus(null);
        setPaymentIn(null);
        setPaymentOut(null);
    }

    function submit() {
        if(debug) console.log(`Total: ${total}`);

        // check if user balance is sufficient
        if(total > userBalance) {
            console.log("Error: user balance not sufficient");
            window.alert("Error: user balance not sufficient");
            return;
        }

        // append correction and cash payment to product array
        let correctionTotal = correctionPlus - correctionMinus;
        let cashPaymentTotal = paymentIn - paymentOut;
        
        let booking = [
            {id: 0, name: "correction", amount: correctionTotal},
            {id: 1, name: "cashpayment", amount: cashPaymentTotal},
        ].concat(products);

        // filter out unbought products
        booking = booking.filter(({amount}) => amount!==0);

        if(debug) console.log(booking);

        commitBooking(user.id, booking);

        if(resetUserCallback)
            resetUserCallback();

        resetProducts();
    }

    function onNewScanResult(decodedText, decodedResult) {
        console.log(decodedResult+" "+decodedText);
        setData(decodedText);
    }

    return(
        <div className="main">
            {showAdminLink && <Link to="/admin">{"Admin"}</Link>}
            <UserSelect setResetCallback={setResetUserCallback} resetCallback={resetUser} runCallback={setUser} useReset={true} hideReset={true} />
            <ProductDisplay tryRemove={!isSufficient} products={products} setProducts={setProducts} />
            <BalanceCorrection plus={correctionPlus} setPlus={setCorrectionPlus} minus={correctionMinus} setMinus={setCorrectionMinus} />
            <CashPayment outVal={paymentOut} setOut={setPaymentOut} inVal={paymentIn} setIn={setPaymentIn} /><br className='wrapper'/>
            {userBalance && <BalanceInfos balance={userBalance} sum={total} />}
            {user && <LastBookings />}
            {hasInput && <button className='wrapper' onClick={resetProducts}>{"reset"}</button>}
            {hasInput && isSufficient && user && <button className="wrapper" onClick={submit}>{"Buchen"}</button>}
            {/* <BarcodeScannerComponent
                width={500}
                height={500}
                onUpdate={(err, result) => {
                if (result) setData(result.text);
                else setData("Not Found");
                }}
            /> */}
            {/* <Html5QrcodePlugin 
                fps={10}
                qrbox={250}
                disableFlip={false}
                qrCodeSuccessCallback={onNewScanResult}/> */}
      <p>{data}</p>
        </div>
    );
}