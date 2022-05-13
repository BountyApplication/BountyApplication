import React, {useState} from 'react';
import NumberInput from '../util/NumberInput';
import { addProduct } from '../util/Database';
import { Form, Button } from 'react-bootstrap';
import Input from '../util/Input';

const debug = true;

export default function AddProduct(props) {
    //vars
    const [productName, setProductName] = useState("");
    const [productPrice, setProductPrice] = useState(null);

    function reset() {
        setProductName("");
        setProductPrice(null);
    }

    function submit() {
        if(productName === "" || productPrice === null) {
            console.log("Error no valid entries");
            window.alert("Error: no valid entries");
            return;
        }
        if(window.confirm("Add Product "+productName+" ("+productPrice+"€) ?")) {
            addProduct(productName, productPrice);

            reset();
        }
    }

    return(
        <div className='rubric'>
            <div className='title'>{"Add Product"}</div>
            <Form>
                <Input title="Name" value={productName} setValue={setProductName} />
                <Input type="number" title="Price" value={productPrice} setValue={setProductPrice} />
                {(productName!=="" || productPrice!=null) && <Button className="ms-2" onClick={reset}>{"reset"}</Button>}
                {(productName!==""&&productPrice!=null)   && <Button className='ms-2' onClick={submit.bind(this)}>{"submit"}</Button>}
            </Form>
        </div>
    );
}