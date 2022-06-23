import React, {useState, useEffect} from 'react';
import {Link} from "react-router-dom";
import ProductDisplay from './ProductDisplay';
import UserSelect from '../util/CombinedUserSearch';
import BalanceInfos from './BalanceInfos';
import BalanceCorrection from './BalanceCorrection';
import CashPayment from './ChashPayment';
import LastBookings from './LastBookings';
import { getProducts, getUserBalance, commitBooking } from '../util/Database';
// import BarcodeScannerComponent from "react-qr-barcode-scanner";
// import Html5QrcodePlugin from '../util/scanner';
import { Col, Row, Collapse } from 'react-bootstrap';
import BookingInfo from './BookingInfo';

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
    const [width, setWidth] = useState(0);

    // temp vars for easier access
    const sum = calculateSum();
    const total = calculateTotal();
    const isSufficient = total<=userBalance;
    const hasInput = (total!==0 || correctionPlus || paymentIn);
    const booking = {
        oldBalance: userBalance,
        newBalance: userBalance-total,
        productSum: sum,
        correction: -correctionMinus+correctionPlus,
        cashPayment: -paymentOut+paymentIn,
        products: products.filter(({amount}) => amount !== 0),
    };

    // executes in beginning
    useEffect(() => {
        window.addEventListener('resize', updateWindowDimensions)

        return () => {
            window.removeEventListener('resize', updateWindowDimensions)
        }
    }, []);

    function updateWindowDimensions() {
        setWidth(window.innerWidth)
    }
    
    // get user balance when user gets selected
    useEffect(() => {
        if(!user) return;
        
        let balance = getUserBalance(user.id);
        if(debug) console.log(`Balance: ${balance}`);
        setUserBalance(balance);
    }, [user]);
    
    function calculateSum() {
        return products.reduce((sum, {price, amount}) => sum+price*amount, 0);
    }

    function calculateTotal() {
        return calculateSum() - correctionPlus + correctionMinus - paymentIn + paymentOut;
    }

    function resetUser() {
        setUser(null);
        setUserBalance(null);
    }

    function runResetUser() {
        if(resetUserCallback)
            resetUserCallback();
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
        
        // let booking = [
        //     {id: 0, name: "correction", amount: correctionTotal},
        //     {id: 1, name: "cashpayment", amount: cashPaymentTotal},
        // ].concat(products);
        booking.products.concat([
            {id: 0, name: "correction", amount: correctionTotal},
            {id: 1, name: "cashpayment", amount: cashPaymentTotal},
        ]);

        // filter out unbought products
        // booking = booking.filter(({amount}) => amount!==0);

        if(debug) console.log(booking);

        commitBooking(user.id, booking);

        runResetUser();

        resetProducts();
    }

    function onNewScanResult(decodedText, decodedResult) {
        console.log(decodedResult+" "+decodedText);
        setData(decodedText);
    }

    return(
        <>
        <div className="main" style={user != null ? {width: `${window.innerWidth-370}px`} : {}}>
            {showAdminLink && <Link to="/admin">{"Admin"}</Link>}
            <UserSelect setResetCallback={setResetUserCallback} resetCallback={resetUser} runCallback={setUser} useSubmit={true} useReset={true} hideSubmit={true} hideReset={true} hideDescription={true} />
            <Collapse in={user != null && userBalance != null}>
                <div>
                    <Row className="m-0 p-3"><ProductDisplay availableBalance={booking.newBalance} isSufficient={isSufficient} products={products} setProducts={setProducts} /></Row>
                    <Row className="m-0"><Col><BalanceCorrection plus={correctionPlus} setPlus={setCorrectionPlus} minus={correctionMinus} setMinus={setCorrectionMinus} /></Col>
                    <Col><CashPayment outVal={paymentOut} setOut={setPaymentOut} inVal={paymentIn} setIn={setPaymentIn} /><br className='wrapper'/></Col></Row>
                    <Row className="m-0 p-3 justify-content-evenly"><Col className='col-auto'><BalanceInfos balance={userBalance} sum={total} /></Col>
                    <Col className="col-auto"><LastBookings /></Col></Row>
                </div>
            </Collapse>
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
            {/* <p>{data}</p> */}
        </div>
        <BookingInfo show={user != null} user={user} resetUserCallback={runResetUser} booking={booking} reset={resetProducts} submit={submit} />
        </>
    );
}