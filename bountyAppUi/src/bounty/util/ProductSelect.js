import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import { useGetProducts } from './Database';
import { Form, Button, Collapse } from 'react-bootstrap';
import { toCurrency } from './Util';

const debug = true;

ProductSelect.propTypes = {
    // callbacks
    runCallback: PropTypes.func,
    resetCallback: PropTypes.func,
    setResetCallback: PropTypes.func,

    // settings
    useReset: PropTypes.bool,
    hideReset: PropTypes.bool,
    useSubmit: PropTypes.bool,
    hideSubmit: PropTypes.bool,
    resetOnSubmit: PropTypes.bool,
    isVertical: PropTypes.bool,
    onlyActive: PropTypes.bool,

    submitDescription: PropTypes.string,
};

ProductSelect.defaultProps = {
    useReset: false,
    useSubmit: false,

    hideReset: false,
    hideSubmit: false,

    resetOnSubmit: false,
    isVertical: false,

    onlyActive: true,

    submitDescription: "submit",
};

export default function ProductSelect({runCallback, resetCallback, setResetCallback, useReset, hideReset, useSubmit, hideSubmit, resetOnSubmit, isVertical, onlyActive, submitDescription}) {
    // vars
    const products = useGetProducts(null, onlyActive);
    const [selectedProductId, setSelectedProductId] = useState(-1);

    // temp vars vor easier access
    const productSelected = selectedProductId!==-1;

    // set callback on beginning
    useEffect(() => {
        if(setResetCallback) setResetCallback(prev => reset);
    }, []);

    // runns when product selected
    useEffect(() => {
        if(productSelected) run();
    }, [selectedProductId]);

    function getSelectedProduct() {
        if(!productSelected) return null;

        return products.find(product => product.productId===selectedProductId);
    }
    
    function getProductString(name, price) {
        if(name==null || price==null) return null;

        return `${name} (${toCurrency(price)})`;
    }
    function getProductStringP(product) {
        if(product==null) return null;

        return getProductString(product.name, product.price);
    }

    function updateProduct(productId) {
        // resets if product selection deleted
        if(productId===-1) return reset();
           
        return setSelectedProductId(productId);
    }

    function run() {
        if(debug) getProductStringP(getSelectedProduct());

        // auto submit if no submit button
        if(!useSubmit) submit();
    }

    function reset() {
        setSelectedProductId(-1);
        if(resetCallback) resetCallback();
    }

    function submit() {
        // checks if product selected
        if(!productSelected) {
            console.log("Error: no valid entries");
            window.alert("Error: no valid entries");
            return;
        }

        if(runCallback) runCallback(getSelectedProduct());
        if(resetOnSubmit) reset();
    }

    return(
        <div className="wrapper p-2">
            <Form className={!isVertical?'row':''}>
                <Form.Group className="col mb-2" controlId={"productSelect"}>
                    <Form.Label className="ps-1">{"Product:"} </Form.Label>
                    <Form.Select value={selectedProductId} onChange={(event) => {updateProduct(parseInt(event.target.value));}}>
                        {<option value={-1}>{productSelected?"Auswahl löschen":"Produkt auswählen"}</option>}
                        {products!=null && products.map(({productId, name, price, active}) => {
                            return <option className={active!==1?'fw-light fst-italic':''} key={productId} value={productId}>{getProductString(name, price)}</option>
                        })}
                    </Form.Select>
                </Form.Group>
                <Collapse className={`${!isVertical?'collapse-horizontal':''} me-2 mb-2`} in={useReset && (productSelected || !hideReset)}>
                    <Button className="button align-self-end" variant="secondary" type="reset" onClick={reset}>{"reset"}</Button>
                </Collapse>
                <Collapse className={`${!isVertical?'collapse-horizontal':''} mb-2`} in={useSubmit && (productSelected || !hideSubmit)}>
                    <Button className="button align-self-end" variant="primary" type="submit" onClick={submit}>{submitDescription}</Button>
                </Collapse>
            </Form>
        </div>
    );
}