import { Offcanvas, Row, Col } from "react-bootstrap";
import PropTypes from 'prop-types';
import BookingDisplay from '../util/BookingDisplay';
import RowText from '../util/RowText';
import { toCurrency } from '../util/Util';

BookingInfo.propTypes = {
    show: PropTypes.bool.isRequired,
    user: PropTypes.object,
    booking: PropTypes.objectOf(PropTypes.shape({
        id: PropTypes.number,
        old: PropTypes.number,
        new: PropTypes.number,
        sum: PropTypes.number.isRequired,
        correction: PropTypes.number,
        cashPayment: PropTypes.number,
        products: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string,
            price: PropTypes.number,
            amount: PropTypes.number
        })).isRequired,
    }))
};

BookingInfo.defaultProps = {
    show: false,
    user: null,
};

export default function BookingInfo({show, user, booking}) {
    const labelText = "fs-4 mx-3";
    const labelTextImportant = "fs-4 fw-bold mx-3";
    const props = {className: labelText, style: {maxWidth: "auto"}};
    return(
    <Offcanvas show={show} placement={'end'} style={{width: "350px"}} backdrop={false} scroll={true}>
        <Offcanvas.Header>
            <Offcanvas.Title className="fs-3 fw-bold">Buchung</Offcanvas.Title>
            <p>{user?`${user.firstname} ${user.lastname}`:null}</p>
        </Offcanvas.Header>
        <Offcanvas.Body>
        <RowText className={labelTextImportant+" mb-2"} left={'Guthaben'} right={toCurrency(booking.old)} />
            <BookingDisplay booking={booking.products.filter(({amount}) => amount!==0) } />
            <RowText className={labelTextImportant} left={'Summe'} right={toCurrency(booking.sum)} />
            <RowText className={labelText} left={'Korrektur'} right={toCurrency(booking.correction)} />
            <RowText className={labelText} left={'Barzahlung'} right={toCurrency(booking.cashPayment)} />
            <RowText className={labelTextImportant} left={'Neu'} right={toCurrency(booking.new)} />
        </Offcanvas.Body>
    </Offcanvas>)
}