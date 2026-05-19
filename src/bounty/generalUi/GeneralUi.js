import React, {useState, useEffect, useContext} from 'react';
import {Link} from "react-router-dom";
import ProductDisplay from './ProductDisplay';
import UserSelect from '../util/CombinedUserSearch';
import CashPayment from './ChashPayment';
import LastBookings from './LastBookings';
import { useGetProducts, useGetUserBalance, commitBooking } from '../util/Database';
import { Col, Row, Collapse, Button } from 'react-bootstrap';
import BookingInfo from './BookingInfo';
import { ThemeContext } from "../../themes/ThemeProvider.js";
import { useKeyPress } from '../util/Util';
import BalanceCorrection from './BalanceCorrection.js';
import BookingSummaryModal from './BookingSummaryModal.js';

const displayDisabledProducts = true;

export default function GeneralUi({showAdminLink = false}) {
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

    const { theme, toggleTheme } = useContext(ThemeContext);

    useGetProducts((products) => setProducts(products.map(product => ({...product, amount: 0}))), !displayDisabledProducts);

    const sum = calculateSum();
    const total = calculateTotal();
    const isSufficient = total<=userBalance;
    const booking = {
        oldBalance: userBalance,
        newBalance: userBalance!==undefined?Math.round((userBalance-total)*100)/100:undefined,
        total: total,
        productSum: sum,
        correction: -correctionMinus+correctionPlus,
        cashPayment: -paymentOut+paymentIn,
        products: products.filter(({amount}) => amount !== 0),
    };

    const [showBookingModal, setShowBookingModal] = useState(false);

    useKeyPress("Enter", () => {
        if(showBookingModal) return;
        if(user==null) return;
        if(!(booking.newBalance!==booking.oldBalance || booking.correction!==0 || booking.cashPayment!==0)) return;
        setShowBookingModal(true);
    });

    useEffect(() => {
        if(user == null) return;
        setOpenUserSelect(false);
    }, [user, userBalance]);

    useEffect(() => {
        document.title = "Bounty Bezahlungssystem";
    }, []);

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

    function openBookingModal() {
        setShowBookingModal(true);
    }

    function confirmBooking() {
        commitBooking(user.userId, booking);
        setShowBookingModal(false);
        runResetUser();
        resetProducts();
    }

    function cancelBooking() {
        setShowBookingModal(false);
    }

    return(
        <>
        <BookingSummaryModal show={showBookingModal} onConfirm={confirmBooking} onCancel={cancelBooking} oldBalance={booking.oldBalance} spent={booking.total} newBalance={booking.newBalance} />
        <div className="main" style={user != null ? {width: `${window.innerWidth-370}px`} : {}}>
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
                    <Col className="mb-2"><Button className='' onClick={()=>setShowCorrection(!showCorrection)}>{showCorrection?'weniger':'mehr'}</Button></Col>
                    {user!=null&&<Col className="col-11"><LastBookings userId={user.userId} /></Col>}</Row>
                </div>
            </Collapse>
        </div>
        <BookingInfo show user={user} openUserSelectCallback={setOpenUserSelect.bind(this, true)} booking={booking} allProducts={products} setProducts={setProducts} reset={resetProducts} submit={openBookingModal} />
        </>
    );
}
