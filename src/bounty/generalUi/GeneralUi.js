import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import ProductDisplay from './ProductDisplay';
import UserSelect from '../util/CombinedUserSearch';
import LastBookings from './LastBookings';
import { useGetProducts, useGetUserBalance, commitBooking } from '../util/Database';
import { Row, Collapse } from 'react-bootstrap';
import BookingInfo from './BookingInfo';
import { ThemeContext } from "../../themes/ThemeProvider.js";
import { useKeyPress } from '../util/Util';
import Adjustment from './Adjustment';
import BookingResult from './BookingResult';
import AdminPasswordModal from '../util/AdminPasswordModal';
import { isAdminUnlocked } from '../util/adminAuth';

const displayDisabledProducts = true;

export default function GeneralUi() {
    const [user, setUser] = useState();
    const userBalance = useGetUserBalance(user);

    const [correctionPlus, setCorrectionPlus] = useState(null);
    const [correctionMinus, setCorrectionMinus] = useState(null);
    const [paymentIn, setPaymentIn] = useState(null);
    const [paymentOut, setPaymentOut] = useState(null);

    const [products, setProducts] = useState([]);
    const [resetUserCallback, setResetUserCallback] = useState();
    const [openUserSelect, setOpenUserSelect] = useState(true);
    const [bookingResult, setBookingResult] = useState(null);
    const [showAdminPrompt, setShowAdminPrompt] = useState(false);

    const { theme, toggleTheme } = useContext(ThemeContext);
    const navigate = useNavigate();

    useGetProducts(
        (p) => setProducts(p.map(product => ({ ...product, amount: 0 }))),
        !displayDisabledProducts
    );

    const sum = calculateSum();
    const total = calculateTotal();
    const isSufficient = total <= userBalance;
    const booking = {
        oldBalance: userBalance,
        newBalance: userBalance !== undefined ? Math.round((userBalance - total) * 100) / 100 : undefined,
        total,
        productSum: sum,
        correction: -(correctionMinus ?? 0) + (correctionPlus ?? 0),
        cashPayment: -(paymentOut ?? 0) + (paymentIn ?? 0),
        products: products.filter(({ amount }) => amount !== 0),
    };

    const hasArticles = booking.products.length > 0;
    const canBook = user != null
        && booking.newBalance >= 0
        && (hasArticles || booking.correction !== 0 || booking.cashPayment !== 0);

    useKeyPress("Enter", () => {
        if (bookingResult != null) return finishBooking();
        if (canBook) submit();
    });

    useEffect(() => {
        if (user == null) return;
        setOpenUserSelect(false);
    }, [user, userBalance]);

    useEffect(() => {
        document.title = "Bounty Bezahlungssystem";
    }, []);

    function calculateSum() {
        return Math.round(products.reduce((s, { price, amount }) => s + price * amount, 0) * 100) / 100;
    }

    function calculateTotal() {
        return parseFloat(
            (calculateSum() - (correctionPlus ?? 0) + (correctionMinus ?? 0) - (paymentIn ?? 0) + (paymentOut ?? 0)).toPrecision(7)
        );
    }

    function resetUser() {
        setUser(null);
        setOpenUserSelect(true);
        resetProducts();
    }

    function runResetUser() {
        if (resetUserCallback) resetUserCallback();
    }

    function resetProducts() {
        setProducts(products.map(p => ({ ...p, amount: 0 })));
        setCorrectionPlus(null);
        setCorrectionMinus(null);
        setPaymentIn(null);
        setPaymentOut(null);
    }

    function submit() {
        commitBooking(user.userId, booking);
        setBookingResult({
            oldBalance: booking.oldBalance,
            spent: booking.total,
            newBalance: booking.newBalance,
        });
    }

    function finishBooking() {
        setBookingResult(null);
        runResetUser();
        resetProducts();
    }

    function openAdmin() {
        if (isAdminUnlocked()) return navigate('/admin');
        setShowAdminPrompt(true);
    }

    const hasSidebar = user != null && userBalance != null;

    return (
        <>
            <div className={`main-area${hasSidebar ? ' with-sidebar' : ''}`}>
                    <header className="pos-header">
                        <div className="pos-brand">
                            <span className="pos-brand-mark"><i className="bi bi-cup-straw" /></span>
                            <span>Bounty Kasse</span>
                        </div>
                        <div className="pos-actions">
                            <button
                                className="icon-btn"
                                onClick={toggleTheme}
                                title={theme === 'light-theme' ? 'Dunkles Design' : 'Helles Design'}
                            >
                                <i className={`bi ${theme === 'light-theme' ? 'bi-moon-stars' : 'bi-sun'}`} />
                            </button>
                            <button className="icon-btn" onClick={openAdmin} title="Verwaltung">
                                <i className="bi bi-gear" />
                            </button>
                        </div>
                    </header>

                    <UserSelect
                        products={products}
                        setProducts={setProducts}
                        inModal
                        show={openUserSelect}
                        setResetCallback={setResetUserCallback}
                        setShow={setOpenUserSelect}
                        resetCallback={resetUser}
                        runCallback={setUser}
                        useSubmit
                        useReset
                        hideSubmit
                        hideReset
                        hideDescription
                    />

                    <Collapse in={hasSidebar}>
                        <div>
                            <Row className="m-0 mb-3">
                                <ProductDisplay
                                    availableBalance={booking.newBalance}
                                    isSufficient={isSufficient}
                                    products={products}
                                    setProducts={setProducts}
                                />
                            </Row>

                            <div className="m-0 mb-3">
                                <Adjustment
                                    channels={[
                                        {
                                            key: 'correction',
                                            label: 'Korrektur',
                                            plus: correctionPlus,
                                            minus: correctionMinus,
                                            setPlus: setCorrectionPlus,
                                            setMinus: setCorrectionMinus,
                                        },
                                        {
                                            key: 'cash',
                                            label: 'Barzahlung',
                                            plus: paymentIn,
                                            minus: paymentOut,
                                            setPlus: setPaymentIn,
                                            setMinus: setPaymentOut,
                                        },
                                    ]}
                                />
                            </div>

                            {user != null && (
                                <Row className="m-0">
                                    <LastBookings userId={user.userId} />
                                </Row>
                            )}
                        </div>
                    </Collapse>
                </div>

            <BookingInfo
                show
                user={user}
                openUserSelectCallback={() => setOpenUserSelect(true)}
                booking={booking}
                allProducts={products}
                setProducts={setProducts}
                reset={resetProducts}
                submit={submit}
            />

            <BookingResult result={bookingResult} onConfirm={finishBooking} />

            <AdminPasswordModal
                show={showAdminPrompt}
                onClose={() => setShowAdminPrompt(false)}
                onSuccess={() => { setShowAdminPrompt(false); navigate('/admin'); }}
            />
        </>
    );
}
