import { Offcanvas, Collapse, Button, Row, OverlayTrigger, Tooltip } from "react-bootstrap";
import PropTypes from 'prop-types';
import BookingDisplay from '../util/BookingDisplay';
import React from 'react';

BookingInfo.propTypes = {
    show: PropTypes.bool.isRequired,
    user: PropTypes.object,
    openUserSelectCallback: PropTypes.func,
    booking: PropTypes.shape({
        bookingId: PropTypes.number,
        oldBalance: PropTypes.number,
        newBalance: PropTypes.number,
        productSum: PropTypes.number,
        correction: PropTypes.number,
        cashPayment: PropTypes.number,
        products: PropTypes.arrayOf(PropTypes.shape({
            productId: PropTypes.number,
            name: PropTypes.string.isRequired,
            price: PropTypes.number.isRequired,
            amount: PropTypes.number.isRequired,
        })).isRequired,
    }),
    reset: PropTypes.func,
    submit: PropTypes.func,
};

BookingInfo.defaultProps = {
    show: false,
    user: null,
    reset: ()=>{},
    submit: ()=>{},
};

UserButton.propTypes = {
    user: PropTypes.object,
    openUserSelectCallback: PropTypes.func,
}

function UserButton({user, openUserSelectCallback}) {
    return <OverlayTrigger
        placement={'auto'}
        overlay={
            <Tooltip>
                { user == null ? 'Benutzer auswählen [s]' : 'Benutzer ändern [s]' }
            </Tooltip>
        }
    >
        <Button variant="secondary" onClick={openUserSelectCallback}>{ user == null ? 'kein Benutzer' : `${user.firstname} ${user.lastname}` }</Button>
    </OverlayTrigger>
}

export default function BookingInfo({show, user, openUserSelectCallback, booking, reset, submit}) {
    const {oldBalance, newBalance, correction, cashPayment} = booking;
    const hasInput = user != null && (newBalance!==oldBalance || correction!==0 || cashPayment!==0)

    return(
    <Offcanvas className="" style={{width: '370px'}} show={show} placement={'end'} backdrop={false} scroll={true}>
        <Offcanvas.Header className="pb-0">
            <Offcanvas.Title className="fs-3 fw-bold">Buchung</Offcanvas.Title>
            <UserButton user={user} openUserSelectCallback={openUserSelectCallback} />
        </Offcanvas.Header>
        <Offcanvas.Body>
            <BookingDisplay booking={booking}>
            <Collapse in={hasInput} >
                <Row className="w-100">
                    <Button className="col my-1" type="reset" variant="secondary" onClick={reset}>Zurücksetzten</Button>
                    <Button className="col ms-2 my-1" type="submit" variant={newBalance<0?'secondary':'primary'} disabled={newBalance<0} onClick={submit} >Buchen</Button>
                </Row>
            </Collapse>
            </BookingDisplay>
        </Offcanvas.Body>
    </Offcanvas>)
}