import { Offcanvas, Row, Col, Collapse } from "react-bootstrap";
import PropTypes from 'prop-types';
import BookingDisplay from '../util/BookingDisplay';
import RowText from '../util/RowText';
import { toCurrency } from '../util/Util';

BookingInfo.propTypes = {
    show: PropTypes.bool.isRequired,
    user: PropTypes.object,
    booking: PropTypes.objectOf(PropTypes.shape({
        id: PropTypes.number,
        oldBalance: PropTypes.number,
        newBalance: PropTypes.number,
        productSum: PropTypes.number.isRequired,
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

export default function BookingInfo({show, user, booking: {oldBalance, newBalance, productSum, correction, cashPayment, products}}) {
    const labelText = "fs-4 mx-3";
    const labelTextImportant = "fs-4 fw-bold mx-3";
    const props = {className: labelText, style: {maxWidth: "auto"}};
    return(
    <Offcanvas show={show} placement={'end'} backdrop={false} scroll={true}>
        <Offcanvas.Header className="pb-0">
            <Offcanvas.Title className="fs-3 fw-bold">Buchung</Offcanvas.Title>
            <p>{user?`${user.firstname} ${user.lastname}`:null}</p>
        </Offcanvas.Header>
        <Offcanvas.Body className="d-flex align-items-start flex-column">
            <Collapse in={oldBalance!=null}><RowText className={labelTextImportant} left={'Guthaben'} right={toCurrency(oldBalance)} /></Collapse>
            <Collapse className="mb-auto" in={products.length!==0}><div><BookingDisplay className="mt-3" booking={products.filter(({amount}) => amount!==0) } /></div></Collapse>
            <Collapse in={productSum!==0}><RowText className={labelTextImportant} left={'Summe'} right={toCurrency(productSum)} /></Collapse>
            <Collapse in={correction!==0}><RowText className={labelText} left={'Korrektur'} right={toCurrency(correction)} /></Collapse>
            <Collapse in={cashPayment!==0}><RowText className={labelText} left={'Barzahlung'} right={toCurrency(cashPayment)} /></Collapse>
            <Collapse in={newBalance!==oldBalance || correction!==0 || cashPayment!==0}><RowText className={labelTextImportant} left={'Neu'} right={toCurrency(newBalance)} /></Collapse>
        </Offcanvas.Body>
    </Offcanvas>)
}