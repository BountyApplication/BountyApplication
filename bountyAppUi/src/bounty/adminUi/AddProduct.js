import React, {useState} from 'react';
import { addProduct } from '../util/Database';
import { Form, Button, Collapse } from 'react-bootstrap';
import Input from '../util/Input';
import Warning from '../util/Warning';
import Confirm from '../util/Confirm';

export default function AddProduct() {
    //vars
    const [productName, setProductName] = useState("");
    const [productPrice, setProductPrice] = useState(null);
    const [showWarning, setShowWarning] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    function reset() {
        setProductName("");
        setProductPrice(null);
    }

    function submit() {
        if(productName === "" || productPrice === null) {
            console.log("Error no valid entries");
            setShowWarning(true);
            return;
        }
        setShowConfirm(true);
    }
    
    function run() {
        addProduct(productName, productPrice);

        reset();
    }

    return(
        <>
        {showWarning ? <Warning text="No valid entries" show={showWarning} setShow={setShowWarning} /> : null}{
        showConfirm ? <Confirm text={`Willst du das Produkt [${productName}] für ${productPrice}€ hinzufügen?`} run={run} show={showConfirm} setShow={setShowConfirm} /> :
        <div className='rubric'>
            <div className='title'>{"Add Product"}</div>
            <Form>
                <Input title="Name" value={productName} setValue={setProductName} />
                <Input type="number" title="Price" value={productPrice} setValue={setProductPrice} />
                <Collapse in={productName!=="" || productPrice!=null}>
                    <Button type="reset" variant="secondary" className="mb-2" onClick={reset}>{"reset"}</Button>
                </Collapse>
                <Collapse in={productName!=="" && productPrice!=null}>
                    <Button type="submit" className='ms-2 mb-2' onClick={submit}>{"submit"}</Button>
                </Collapse>
            </Form>
        </div>}
        </>
    );
}