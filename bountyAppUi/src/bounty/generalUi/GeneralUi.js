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

const debug = true;

export default function GeneralUi({showAdminLink = false}) {
    // vars   
    const [user, setUser] = useState();
    const userBalance = useGetUserBalance(user);

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
        newBalance: userBalance-total,
        total: total,
        productSum: sum,
        correction: -correctionMinus+correctionPlus,
        cashPayment: -paymentOut+paymentIn,
        products: products.filter(({amount}) => amount !== 0),
    };

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
        return products.reduce((sum, {price, amount}) => sum+price*amount, 0);
    }

    function calculateTotal() {
        return calculateSum() - correctionPlus + correctionMinus - paymentIn + paymentOut;
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
        if(total > userBalance) {
            console.log("Error: user balance not sufficient");
            window.alert("Error: user balance not sufficient");
            return;
        }

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
        <div className="main" style={user != null ? {width: `${window.innerWidth-370}px`} : {}}>
            {showAdminLink && <Link to="/admin">{"Admin"}</Link>}
            <Button onClick={ toggleTheme}>{theme==='light-theme'?'Dark Mode':'Light Mode'}</Button>
            <UserSelect inModal show={openUserSelect} setResetCallback={setResetUserCallback} setShow={setOpenUserSelect} resetCallback={resetUser} runCallback={setUser} useSubmit useReset hideSubmit hideReset hideDescription />
            <Collapse in={user != null && userBalance != null}>
                <div>
                    <Row className="m-0 p-3"><ProductDisplay availableBalance={booking.newBalance} isSufficient={isSufficient} products={products} setProducts={setProducts} /></Row>
                    <Row className="m-0"><Col><BalanceCorrection plus={correctionPlus} setPlus={setCorrectionPlus} minus={correctionMinus} setMinus={setCorrectionMinus} /></Col>
                    <Col><CashPayment outVal={paymentOut} setOut={setPaymentOut} inVal={paymentIn} setIn={setPaymentIn} /><br className='wrapper'/></Col></Row>
                    <Row className="m-0 p-3 justify-content-evenly">
                    {user!=null&&<Col className="col-auto"><LastBookings userId={user.userId} /></Col>}</Row>
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
        <BookingInfo show user={user} openUserSelectCallback={setOpenUserSelect.bind(this, true)} booking={booking} reset={resetProducts} submit={submit} />
        </>
    );
}