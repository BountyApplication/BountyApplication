import React, {useState, useEffect, useContext} from 'react';
import {Link} from "react-router-dom";
import ProductDisplay from './ProductDisplay';
import UserSelect from '../util/CombinedUserSearch';
import BalanceInfos from './BalanceInfos';
import BalanceCorrection from './BalanceCorrection';
import CashPayment from './ChashPayment';
import LastBookings from './LastBookings';
import { useGetProducts, useGetUserBalance, commitBooking } from '../util/Database';
// import BarcodeScannerComponent from "react-qr-barcode-scanner";
// import Html5QrcodePlugin from '../util/scanner';
import { Col, Row, Collapse, Button } from 'react-bootstrap';
import BookingInfo from './BookingInfo';
import { ThemeContext } from "../../themes/ThemeProvider.js";
import Confirm from '../util/Confirm';
import { useKeyPress } from '../util/Util';

const debug = true;

export default function GeneralUi({showAdminLink = false}) {
    // vars   
    const [user, setUser] = useState();
    const userBalance = useGetUserBalance(user);

    const [showCorrection, setShowCorrection] = useState(false);
    const [correctionPlus, setCorrectionPlus] = useState(null);
    const [correctionMinus, setCorrectionMinus] = useState(null);
    const [paymentIn, setPaymentIn] = useState(null);
    const [paymentOut, setPaymentOut] = useState(null);

    const [products, setProducts] = useState([]);
    
    const [resetUserCallback, setResetUserCallback] = useState();
    
    const [openUserSelect, setOpenUserSelect] = useState(true);

    const [data, setData] = useState('No result');

    const [width, setWidth] = useState(0);

    const { theme, toggleTheme } = useContext(ThemeContext);

    useGetProducts((products) => setProducts(products.map(product => ({...product, amount: 0}))));

    // temp vars for easier access
    const sum = calculateSum();
    const total = calculateTotal();
    const isSufficient = total<=userBalance;
    const booking = {
        oldBalance: userBalance,
        newBalance: userBalance!=undefined?Math.round((userBalance-total)*100)/100:undefined,
        total: total,
        productSum: sum,
        correction: -correctionMinus+correctionPlus,
        cashPayment: -paymentOut+paymentIn,
        products: products.filter(({amount}) => amount !== 0),
    };

    const [showConfirm, setShowConfirm] = useState(false);
    
    useKeyPress("Enter", () => {
        if(user==null) return;
        if(!(booking.newBalance!==booking.oldBalance || booking.correction!==0 || booking.cashPayment!==0)) return;
        if(!showConfirm) return setShowConfirm(true);
        setShowConfirm(false);
    });

    useEffect(() => {
        if(user == null) return;
        setOpenUserSelect(false);        
        if(debug) console.log(`Balance: ${userBalance}`);
    }, [user]);

     // executes in beginning
     useEffect(() => {
        document.title = "Bounty Bezahlungssystem";


        window.addEventListener('resize', updateWindowDimensions)

        return () => {
            window.removeEventListener('resize', updateWindowDimensions)
        }
    }, []);

    function updateWindowDimensions() {
        setWidth(window.innerWidth)
    }

    function calculateSum() {
        return Math.round(products.reduce((sum, {price, amount}) => sum+price*amount, 0)*100)/100;
    }

    function calculateTotal() {
        return parseFloat((calculateSum() - correctionPlus + correctionMinus - paymentIn + paymentOut).toPrecision(7));
    }

    function resetUser() {
        setUser(null);
        setOpenUserSelect(true);
        resetProducts();
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
        // if(total > userBalance) {
        //     console.log("Error: user balance not sufficient");
        //     window.alert("Error: user balance not sufficient");
        //     return;
        // }

        // append correction and cash payment to product array
        let correctionTotal = correctionPlus - correctionMinus;
        let cashPaymentTotal = paymentIn - paymentOut;
        
        // let booking = [
        //     {productId: 0, name: "correction", amount: correctionTotal},
        //     {productId: 1, name: "cashpayment", amount: cashPaymentTotal},
        // ].concat(products);

        // booking.products.concat([
        //     {productId: 0, name: "correction", amount: correctionTotal},
        //     {productId: 1, name: "cashpayment", amount: cashPaymentTotal},
        // ]);

        // filter out unbought products
        // booking = booking.filter(({amount}) => amount!==0);

        if(debug) console.log(booking);

        commitBooking(user.userId, booking);

        runResetUser();

        resetProducts();
    }

    function onNewScanResult(decodedText, decodedResult) {
        console.log(decodedResult+" "+decodedText);
        setData(decodedText);
    }

    return(
        <>
        <Confirm show={showConfirm} setShow={setShowConfirm} run={submit} title="Buchung fortsetzen" text="Möchtest du mit der Buchung vorfahren?" hasBreak={true} /> 
        {!showConfirm && <div className="main" style={user != null ? {width: `${window.innerWidth-370}px`} : {}}>
            {showAdminLink && <Link to="/admin">{"Admin"}</Link>}
            <Button className='bg-transparent fixed-bottom border-0' style={{width: 'min-content'}} onClick={ toggleTheme}>{theme==='light-theme'?<i className="bi bi-moon-fill text-dark"></i>:<i className="bi bi-sun-fill"></i>}</Button>
            <UserSelect products={products} setProducts={setProducts} inModal show={openUserSelect} setResetCallback={setResetUserCallback} setShow={setOpenUserSelect} resetCallback={resetUser} runCallback={setUser} useSubmit useReset hideSubmit hideReset hideDescription />
            <Collapse in={user != null && userBalance != null}>
                <div>
                    <Row className="m-0 p-3 pb-4"><ProductDisplay availableBalance={booking.newBalance} isSufficient={isSufficient} products={products} setProducts={setProducts} /></Row>
                    <Collapse in={showCorrection}>
                        <Row className="m-1 mt-0 mb-0"><Col className='mb-0'><BalanceCorrection plus={correctionPlus} setPlus={setCorrectionPlus} minus={correctionMinus} setMinus={setCorrectionMinus} /></Col>
                        <Col className="mb-0"><CashPayment outVal={paymentOut} setOut={setPaymentOut} inVal={paymentIn} setIn={setPaymentIn} /><br className='wrapper'/></Col></Row>
                    </Collapse>
                    <Row className="m-0 p-3 pt-0 justify-content-evenly">
                    <Col className=""><Button className='' onClick={()=>setShowCorrection(!showCorrection)}>{showCorrection?'hide':'more'}</Button></Col>
                    {user!=null&&<Col className="col-11"><LastBookings userId={user.userId} /></Col>}</Row>
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
        </div>}
        {!showConfirm && <BookingInfo show user={user} openUserSelectCallback={setOpenUserSelect.bind(this, true)} booking={booking} allProducts={products} setProducts={setProducts} reset={resetProducts} submit={submit} />}
        </>
    );
}
