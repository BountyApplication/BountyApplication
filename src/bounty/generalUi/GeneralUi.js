import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import ProductDisplay from './ProductDisplay';
import UserSelect from '../util/CombinedUserSearch';
import LastBookings from './LastBookings';
import { useGetProducts, useGetUserAccount, useGetSettings, commitBooking } from '../util/Database';
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
    const account = useGetUserAccount(user);
    const userBalance = account?.balance;

    const [correctionPlus, setCorrectionPlus] = useState(null);
    const [correctionMinus, setCorrectionMinus] = useState(null);
    const [paymentIn, setPaymentIn] = useState(null);
    const [paymentOut, setPaymentOut] = useState(null);
    const [donation, setDonation] = useState(null);

    const [products, setProducts] = useState([]);
    const [resetUserCallback, setResetUserCallback] = useState();
    const [openUserSelect, setOpenUserSelect] = useState(true);
    const [bookingResult, setBookingResult] = useState(null);
    const [showAdminPrompt, setShowAdminPrompt] = useState(false);

    const { theme, toggleTheme } = useContext(ThemeContext);
    const navigate = useNavigate();
    const settings = useGetSettings();
    const payoutMode = settings?.payout === 'on';

    useGetProducts(
        (p) => setProducts(prev => p.map(product => {
            const existing = prev.find(({ productId }) => productId === product.productId);
            return { ...product, amount: existing ? existing.amount : 0 };
        })),
        !displayDisabledProducts
    );

    const sum = calculateSum();
    const total = calculateTotal();
    const isSufficient = userBalance == null || total <= userBalance;
    // what is still returnable, already including what the current cart adds or gives back
    const depositLeft = (account?.deposit ?? 0)
        + products.reduce((left, { deposit, amount }) => left + (deposit ?? 0) * amount, 0);
    const booking = {
        oldBalance: userBalance,
        newBalance: userBalance !== undefined ? Math.round((userBalance - total) * 100) / 100 : undefined,
        total,
        productSum: sum,
        correction: -(correctionMinus ?? 0) + (correctionPlus ?? 0),
        cashPayment: -(paymentOut ?? 0) + (paymentIn ?? 0),
        donation: donation ?? 0,
        products: products.filter(({ amount }) => amount !== 0),
        // kept apart from the netted values above so the display can show both directions
        correctionPlus, correctionMinus, paymentIn, paymentOut,
    };

    const hasArticles = booking.products.length > 0;
    // checks the entered fields, not the netted values: 5 in and 5 out cancel out but are still a booking
    const hasEntries = [correctionPlus, correctionMinus, paymentIn, paymentOut, donation].some(v => (v ?? 0) !== 0);
    const canBook = user != null
        && booking.newBalance >= 0
        && (hasArticles || hasEntries);

    useKeyPress("Enter", () => {
        if (bookingResult != null) return finishBooking();
        if (canBook) submit();
    });

    // leaves the customer only when nothing would get lost, the selection handles Escape on its own
    useKeyPress("Escape", () => {
        if (bookingResult != null) return;
        if (openUserSelect) return;
        if (user == null) return;
        if (hasArticles || hasEntries) return;
        runResetUser();
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
            (calculateSum() - (correctionPlus ?? 0) + (correctionMinus ?? 0) - (paymentIn ?? 0) + (paymentOut ?? 0) + (donation ?? 0)).toPrecision(7)
        );
    }

    // both quick actions bring the resulting balance down to zero
    function payOutRest() {
        if (!(booking.newBalance > 0)) return;
        setPaymentOut(Math.round(((paymentOut ?? 0) + booking.newBalance) * 100) / 100);
    }

    function donateRest() {
        if (!(booking.newBalance > 0)) return;
        setDonation(Math.round(((donation ?? 0) + booking.newBalance) * 100) / 100);
    }

    // pays out full euros and leaves the odd cents as a donation
    function payOutRoundedAndDonateRest() {
        if (!(booking.newBalance > 0)) return;
        const fullEuros = Math.floor(booking.newBalance);
        const rest = Math.round((booking.newBalance - fullEuros) * 100) / 100;
        if (fullEuros > 0) setPaymentOut(Math.round(((paymentOut ?? 0) + fullEuros) * 100) / 100);
        if (rest > 0) setDonation(Math.round(((donation ?? 0) + rest) * 100) / 100);
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
        setProducts(prev => prev.map(p => ({ ...p, amount: 0 })));
        setCorrectionPlus(null);
        setCorrectionMinus(null);
        setPaymentIn(null);
        setPaymentOut(null);
        setDonation(null);
    }

    function submit() {
        commitBooking(user.userId, booking);
        setBookingResult({
            oldBalance: booking.oldBalance,
            spent: booking.total,
            newBalance: booking.newBalance,
            products: booking.products,
            productSum: booking.productSum,
            correctionPlus: booking.correctionPlus,
            correctionMinus: booking.correctionMinus,
            paymentIn: booking.paymentIn,
            paymentOut: booking.paymentOut,
            donation: booking.donation,
        });
        resetProducts();
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

    const hasSidebar = user != null;

    return (
        <>
            <div className={`main-area${hasSidebar ? ' with-sidebar' : ''}`}>
                    <header className="pos-header">
                        <div className="pos-brand">
                            <span className="pos-brand-mark"><i className="bi bi-cup-straw" /></span>
                            <span>Bounty Kasse</span>
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
                        theme={theme}
                        toggleTheme={toggleTheme}
                        onOpenAdmin={openAdmin}
                        disabled={bookingResult != null}
                    />

                    <Collapse in={hasSidebar}>
                        <div>
                            <Row className="m-0 mb-3">
                                <ProductDisplay
                                    availableBalance={booking.newBalance}
                                    isSufficient={isSufficient}
                                    depositLeft={depositLeft}
                                    products={products}
                                    setProducts={setProducts}
                                />
                            </Row>

                            <div className="m-0 mb-3">
                                <Adjustment
                                    defaultNegative={payoutMode}
                                    channels={[
                                        {
                                            key: 'payIn',
                                            label: 'Einzahlung',
                                            direction: 'plus',
                                            plus: paymentIn,
                                            minus: null,
                                            setPlus: setPaymentIn,
                                            setMinus: () => {},
                                        },
                                        {
                                            key: 'payOut',
                                            label: 'Auszahlung',
                                            direction: 'minus',
                                            plus: null,
                                            minus: paymentOut,
                                            setPlus: () => {},
                                            setMinus: setPaymentOut,
                                        },
                                        {
                                            key: 'correction',
                                            label: 'Korrekturbuchung',
                                            plus: correctionPlus,
                                            minus: correctionMinus,
                                            setPlus: setCorrectionPlus,
                                            setMinus: setCorrectionMinus,
                                        },
                                        ...(payoutMode ? [{
                                            key: 'donation',
                                            label: 'Spende',
                                            direction: 'minus',
                                            plus: null,
                                            minus: donation,
                                            setPlus: () => {},
                                            setMinus: setDonation,
                                        }] : []),
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
                resetUser={runResetUser}
                submit={submit}
                depositLeft={depositLeft}
                hasEntries={hasEntries}
                payoutMode={payoutMode}
                payOutRest={payOutRest}
                donateRest={donateRest}
                payOutRoundedAndDonateRest={payOutRoundedAndDonateRest}
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
