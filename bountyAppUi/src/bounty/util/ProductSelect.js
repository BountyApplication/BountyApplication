import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import { getProducts } from './Database';
import { Form, Button, Collapse } from 'react-bootstrap';

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

    submitDescription: PropTypes.string,
};

ProductSelect.defaultProps = {
    useReset: false,
    useSubmit: false,

    hideReset: false,
    hideSubmit: false,

    resetOnSubmit: false,
    isVertical: false,

    submitDescription: "submit",
};

export default function ProductSelect({runCallback, resetCallback, setResetCallback, useReset, hideReset, useSubmit, hideSubmit, resetOnSubmit, isVertical, submitDescription}) {
    // vars
    const [products, setProducts] = useState(getProducts);
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

        return products.find(product => product.id===selectedProductId);
    }
    
    function getProductString(name, price) {
        if(name==null || price==null) return null;

        return `${name}(${+price.toFixed(2)}€)`;
    }
    function getProductStringP(product) {
        if(product==null) return null;

        return getProductString(product.name, product.price);
    }

    function updateProduct(id) {
        // resets if product selection deleted
        if(id===-1) return reset();
           
        return setSelectedProductId(id);
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
                        {products.map(({id, name, price}) => {
                            return <option key={id} value={id}>{getProductString(name, price)}</option>
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