import { Offcanvas, Collapse, Button, Row, OverlayTrigger, Tooltip } from "react-bootstrap";
import PropTypes from 'prop-types';
import BookingDisplay from '../util/BookingDisplay';
import RowText from '../util/RowText';
import { toCurrency } from '../util/Util';
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

export default function BookingInfo({show, user, openUserSelectCallback, booking: {oldBalance, newBalance, productSum, correction, cashPayment, products}, reset, submit}) {
    const labelText = "fs-4 px-0";
    const labelTextImportant = "fs-4 fw-bold px-0";
    const hasInput = user != null && (newBalance!==oldBalance || correction!==0 || cashPayment!==0)
    const ref = React.createRef();
    return(
    <Offcanvas className="" style={{width: '370px'}} show={show} placement={'end'} backdrop={false} scroll={true}>
        <Offcanvas.Header className="pb-0">
            <Offcanvas.Title className="fs-3 fw-bold">Buchung</Offcanvas.Title>
            <UserButton user={user} openUserSelectCallback={openUserSelectCallback} />
        </Offcanvas.Header>
        <Offcanvas.Body className="d-flex align-items-center flex-column">
            <Collapse in={oldBalance!=null}><RowText ref={ref} className={labelTextImportant} left={'Guthaben'} right={toCurrency(oldBalance)} /></Collapse>
            <Collapse className="mb-auto w-100" in={products.length!==0}><div className='overflow-auto'><BookingDisplay className="mt-3" booking={products.filter(({amount}) => amount!==0) } /></div></Collapse>
            <Collapse in={productSum!==0}><RowText ref={ref} className={labelTextImportant} left={'Summe'} right={toCurrency(productSum)} /></Collapse>
            <Collapse in={correction!==0}><RowText ref={ref} className={labelText} left={'Korrektur'} right={toCurrency(correction)} /></Collapse>
            <Collapse in={cashPayment!==0}><RowText ref={ref} className={labelText} left={'Barzahlung'} right={toCurrency(cashPayment)} /></Collapse>
            <Collapse in={hasInput} >
                <Row className="w-100">
                    <Button className="col my-1" type="reset" variant="secondary" onClick={reset}>Zurücksetzten</Button>
                    <Button className="col ms-2 my-1" type="submit" variant={newBalance<0?'secondary':'primary'} disabled={newBalance<0} onClick={submit} >Buchen</Button>
                </Row>
            </Collapse>
            <Collapse in={hasInput}><RowText ref={ref} className={labelTextImportant} left={'Neu'} right={toCurrency(newBalance)} /></Collapse>
        </Offcanvas.Body>
    </Offcanvas>)
}