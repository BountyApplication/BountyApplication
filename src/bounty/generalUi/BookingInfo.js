import { Offcanvas, Collapse, Button } from "react-bootstrap";
import PropTypes from 'prop-types';
import BookingDisplay from '../util/BookingDisplay';
import React from 'react';

BookingInfo.propTypes = {
    show: PropTypes.bool.isRequired,
    user: PropTypes.object,
    openUserSelectCallback: PropTypes.func,
    booking: PropTypes.shape({
        oldBalance: PropTypes.number,
        newBalance: PropTypes.number,
        productSum: PropTypes.number,
        correction: PropTypes.number,
        cashPayment: PropTypes.number,
        products: PropTypes.array.isRequired,
    }),
    reset: PropTypes.func,
    resetUser: PropTypes.func,
    submit: PropTypes.func,
    depositLeft: PropTypes.number,
};

BookingInfo.defaultProps = {
    show: false,
    user: null,
    reset: () => {},
    resetUser: () => {},
    submit: () => {},
};

export default function BookingInfo({ show, user, openUserSelectCallback, booking, allProducts, setProducts, reset, resetUser, submit, depositLeft }) {
    const { newBalance, correction, cashPayment, products } = booking;
    const hasArticles = Array.isArray(products) && products.some(p => p.amount !== 0);
    const hasInput = user != null && (hasArticles || correction !== 0 || cashPayment !== 0);
    const negativeBalance = newBalance < 0;

    return (
        <Offcanvas
            className="booking-offcanvas"
            show={show}
            placement="end"
            backdrop={false}
            scroll={true}
        >
            <Offcanvas.Header className="border-bottom pb-2">
                <div className="d-flex align-items-center gap-2 flex-wrap w-100">
                    <Offcanvas.Title className="fw-bold fs-4 me-auto">Buchung</Offcanvas.Title>
                    <Button
                        variant={user == null ? 'outline-primary' : 'outline-secondary'}
                        size="sm"
                        onClick={openUserSelectCallback}
                        title="Kunde wechseln [a]"
                    >
                        <i className={`bi ${user == null ? 'bi-person-plus' : 'bi-person'} me-1`} />
                        {user == null
                            ? 'Kunde wählen'
                            : `${user.firstname} ${user.lastname}`
                        }
                    </Button>
                    {user != null && (
                        <button
                            type="button"
                            className="icon-btn"
                            onClick={resetUser}
                            title="Kunde abwählen"
                        >
                            <i className="bi bi-x-lg" />
                        </button>
                    )}
                </div>
            </Offcanvas.Header>

            <Offcanvas.Body className="d-flex flex-column">
                <BookingDisplay
                    booking={booking}
                    allProducts={allProducts}
                    setProducts={setProducts}
                    depositLeft={depositLeft}
                >
                    <Collapse in={hasInput}>
                        <div className="mt-auto pt-3 border-top">
                            {negativeBalance && (
                                <div className="mb-2 text-danger small d-flex align-items-center gap-1">
                                    <i className="bi bi-exclamation-triangle-fill" />
                                    Kontostand würde negativ
                                </div>
                            )}
                            <div className="d-flex gap-2">
                                <Button
                                    className="flex-fill"
                                    variant="outline-secondary"
                                    type="reset"
                                    onClick={reset}
                                >
                                    <i className="bi bi-arrow-counterclockwise me-1" />
                                    Zurücksetzen
                                </Button>
                                <Button
                                    className="flex-fill"
                                    variant={negativeBalance ? 'outline-danger' : 'primary'}
                                    type="submit"
                                    onClick={submit}
                                    disabled={negativeBalance}
                                >
                                    <i className="bi bi-check-lg me-1" />
                                    Buchen
                                </Button>
                            </div>
                        </div>
                    </Collapse>
                </BookingDisplay>
            </Offcanvas.Body>
        </Offcanvas>
    );
}
