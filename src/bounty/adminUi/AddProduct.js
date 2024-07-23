import React, {useState} from 'react';
import { addProduct } from '../util/Database';
import { Form, Button, Collapse, Card } from 'react-bootstrap';
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
        <div className='d-flex justify-content-center'>
        {showWarning ? <Warning text="No valid entries" show={showWarning} setShow={setShowWarning} /> : null}
        {showConfirm ? <Confirm text={`Willst du das Produkt [${productName}] für ${productPrice}€ hinzufügen?`} run={run} show={showConfirm} setShow={setShowConfirm} /> :
        <Card className='w-auto mt-3' style={{minWidth: 38+'%'}}>
            <Card.Header>
                <Card.Title>Produkt Hinzufügen</Card.Title>
            </Card.Header>
            <Card.Body>
                <Form>
                    <Input title="Name" value={productName} setValue={setProductName} isFocused />
                    <Input type="number" title="Price" value={productPrice} setValue={setProductPrice} />
                    <div className='d-flex justify-content-end'>
                        <Collapse in={productName!=="" || productPrice!=null}>
                            <Button type="reset" variant="secondary" className="ms-2" onClick={reset}>{"reset"}</Button>
                        </Collapse>
                        <Collapse in={productName!=="" && productPrice!=null}>
                            <Button type="submit" className='ms-2' onClick={submit}>{"submit"}</Button>
                        </Collapse>
                    </div>
                </Form>
            </Card.Body>
        </Card>}
        </div>
    );
}