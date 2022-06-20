import { Offcanvas, Collapse, Button, Row } from "react-bootstrap";
import PropTypes from 'prop-types';
import BookingDisplay from '../util/BookingDisplay';
import RowText from '../util/RowText';
import { toCurrency } from '../util/Util';

BookingInfo.propTypes = {
    show: PropTypes.bool.isRequired,
    user: PropTypes.object,
    booking: PropTypes.shape({
        id: PropTypes.number,
        oldBalance: PropTypes.number,
        newBalance: PropTypes.number,
        productSum: PropTypes.number,
        correction: PropTypes.number,
        cashPayment: PropTypes.number,
        products: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.number,
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

export default function BookingInfo({show, user, booking: {oldBalance, newBalance, productSum, correction, cashPayment, products}, reset, submit}) {
    const labelText = "fs-4 px-0";
    const labelTextImportant = "fs-4 fw-bold px-0";
    const props = {className: labelText, style: {maxWidth: "auto"}};
    const hasInput = newBalance!==oldBalance || correction!==0 || cashPayment!==0
    return(
    <Offcanvas show={show} placement={'end'} backdrop={false} scroll={true}>
        <Offcanvas.Header className="pb-0">
            <Offcanvas.Title className="fs-3 fw-bold">Buchung</Offcanvas.Title>
            <p>{user?`${user.firstname} ${user.lastname}`:null}</p>
        </Offcanvas.Header>
        <Offcanvas.Body className="d-flex align-items-center flex-column">
            <Collapse in={oldBalance!=null}><RowText className={labelTextImportant} left={'Guthaben'} right={toCurrency(oldBalance)} /></Collapse>
            <Collapse className="mb-auto w-100" in={products.length!==0}><div><BookingDisplay className="mt-3" booking={products.filter(({amount}) => amount!==0) } /></div></Collapse>
            <Collapse in={productSum!==0}><RowText className={labelTextImportant} left={'Summe'} right={toCurrency(productSum)} /></Collapse>
            <Collapse in={correction!==0}><RowText className={labelText} left={'Korrektur'} right={toCurrency(correction)} /></Collapse>
            <Collapse in={cashPayment!==0}><RowText className={labelText} left={'Barzahlung'} right={toCurrency(cashPayment)} /></Collapse>
            <Collapse in={hasInput} >
                <Row className="w-100">
                    <Button className="col my-1" type="reset" variant="secondary" onClick={reset}>{"reset"}</Button>
                    <Button className="col ms-2 my-1" type="submit" variant={newBalance<0?'secondary':'primary'} disabled={newBalance<0} onClick={submit} >{"Buchen"}</Button>
                </Row>
            </Collapse>
            <Collapse in={hasInput}><RowText className={labelTextImportant} left={'Neu'} right={toCurrency(newBalance)} /></Collapse>
        </Offcanvas.Body>
    </Offcanvas>)
}