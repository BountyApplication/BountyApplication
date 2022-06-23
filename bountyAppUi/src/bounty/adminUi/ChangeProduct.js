import React, {useState, useEffect} from 'react';
import ProductSelect from '../util/ProductSelect';
import { changeProduct } from '../util/Database';
import {Form, Button, Collapse} from 'react-bootstrap';
import Input from '../util/Input';

export default function ChangeProduct(props) {
    // vars
    const [product, setProduct] = useState(null);
    const [updatedProduct, setUpdatedProduct] = useState(null);

    const [resetCallback, setResetCallback] = useState();

    useEffect(() => {
        setUpdatedProduct(product);
    }, [product]);

    function resetAll() {
        setProduct(null);
        // setUpdatedProduct(null);
    }
    
    function reset() {
        setUpdatedProduct(product);
    }

    function submit() {
        if(product===updatedProduct) {
            console.log("nothing changed");
            window.alert("Nothing changed");
            return;
        }
        if(updatedProduct.name==="" || updatedProduct.price==null) {
            console.log("Error no valid entries");
            window.alert("Error: No valid entries");
            return;
        }
        if(window.confirm("Change Product "+product.name+" ("+product.price+"€) to "+updatedProduct.name+" ("+updatedProduct.price+"€) ?")) {
            console.log(updatedProduct);
            changeProduct(product, updatedProduct);

        if(resetCallback)
            resetCallback();
        }
    }

    function changeProductUi() {
        return(
            <div>
                <Form>
                    <Input title="Name" value={updatedProduct.name} setValue={name => setUpdatedProduct({...updatedProduct, name: name})} />
                    <Input type="number" title="Preis" value={updatedProduct.price} setValue={price => setUpdatedProduct({...updatedProduct, price: price})} />
                    <Collapse in={updatedProduct!==product}>
                        <div>
                            <Button variant="secondary" type="reset" className='mb-2' onClick={reset.bind(this)}>{"reset"}</Button>
                            <Button type="submit" className='ms-2 mb-2' onClick={submit.bind(this)}>{"submit"}</Button>
                        </div>
                    </Collapse>
                </Form>
            </div>
        );
    }

    return(
        <div className='rubric'>
            <div className='title'>{"Change Product"}</div>
            <ProductSelect runCallback={setProduct} resetCallback={resetAll} setResetCallback={setResetCallback} useReset={true} hideReset={true} />
            <Collapse in={updatedProduct}>
                <div>
                    {updatedProduct && changeProductUi()} 
                </div>
            </Collapse>
        </div>
    );
}