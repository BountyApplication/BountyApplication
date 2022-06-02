import React, {useState} from 'react';
import NumberInput from '../util/NumberInput';
import { addProduct } from '../util/Database';

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
            <div className='wrapper'>{"Name: "} <input value={productName} onChange={event => setProductName(event.target.value)} /></div>
            <div className='wrapper'>{"Price: "} <NumberInput value={productPrice} setValue={setProductPrice} /></div>
            {(productName!=="" || productPrice!=null) && <button className='wrapper' onClick={reset}>{"reset"}</button>}                {(productName!==""&&productPrice!=null)&&<button className='wrapper' onClick={submit.bind(this)}>{"submit"}</button>}
        </div>
    );
}