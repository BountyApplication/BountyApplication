import React, {useState, useEffect} from 'react';
import ProductSelect from '../util/ProductSelect';
import { changeProduct, removeProduct } from '../util/Database';
import {Form, Button, Collapse, Card, Row} from 'react-bootstrap';
import Confirm from '../util/Confirm';
import Input from '../util/Input';
import { arraysEqual, toCurrency } from '../util/Util.js';

export default function ChangeProduct(props) {
    // vars
    const [product, setProduct] = useState(null);
    const [updatedProduct, setUpdatedProduct] = useState(null);

    const [resetCallback, setResetCallback] = useState();
    const [showConfirmRemove, setShowConfirmRemove] = useState(false);
    const [showConfirmChange, setShowConfirmChange] = useState(false);

    useEffect(() => {
        if(product == null) return;
        setUpdatedProduct(product);
    }, [product]);

    function resetAll() {
        setProduct(null);
        setUpdatedProduct(null);
    }
    
    function reset() {
        setUpdatedProduct(product);
    }

    function openRemove() {
        if(product == null) return window.alert("Warning: No Product selected");
        setShowConfirmRemove(true);
    }

    function remove() {
        console.log(product);
        removeProduct(product);
        resetAll();
    }

    function openChange() {
        if(product == null) return window.alert("Warning: No Product selected");
        if(arraysEqual(product, updatedProduct)) return window.alert("Nothing changed");
        setShowConfirmChange(true);
    }

    function change() {
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
        
        console.log(updatedProduct);
        changeProduct(product, updatedProduct);

        if(resetCallback) resetCallback();
    }

    function changeProductUi() {
        return(
            <Form>
                <Input title="Name" value={updatedProduct.name} setValue={name => setUpdatedProduct({...updatedProduct, name: name})} isFocused />
                <Input type="number" title="Preis" value={updatedProduct.price} setValue={price => setUpdatedProduct({...updatedProduct, price: price})} />
                <div className='d-flex'>
                    <div className="form-check form-switch  d-flex justify-content-left p-0">
                        <label className="form-check-label fs-5 ms-1" htmlFor="flexSwitchCheckChecked">Aktiv:</label>
                        <input className="form-check-input d-inline float-end ms-2" style={{height: '1.6rem', width: '3.2rem'}} type="checkbox" checked={updatedProduct.active===1} onChange={()=>{setUpdatedProduct({...updatedProduct, active: (updatedProduct.active?0:1)});}}></input>
                    </div>
                    <div className='w-100 d-flex justify-content-end'>
                        <Collapse in={product!=null}>
                            <div>
                                <Button className='bg-danger h-100 border-0 d-inline' onClick={openRemove}><i className="bi bi-trash3"></i></Button>
                            </div>
                        </Collapse>
                        <Collapse in={!arraysEqual(updatedProduct, product)}>
                            <div>
                                <Button variant="secondary" type="reset" className='ms-2' onClick={reset}>{"reset"}</Button>
                                <Button type="submit" className='ms-2' onClick={openChange}>{"submit"}</Button>
                            </div>
                        </Collapse>
                    </div>
                </div>
            </Form>
        );
    }

    return(
        <div className='d-flex justify-content-center'>
        <Card className='w-25 mt-3'>
            <Card.Header>
                <Card.Title>Produkt Bearbeiten</Card.Title>
            </Card.Header>
            {showConfirmRemove ? <Confirm text={`Willst du das Product ${product.name} für ${toCurrency(product.price)} wirklich entfernen?`} run={remove} show={showConfirmRemove} setShow={setShowConfirmRemove} /> :
            showConfirmChange ? <Confirm text={`Willst du das Product ${product.name} (${toCurrency(product.price)}) wirklich zu ${updatedProduct.name} (${toCurrency(updatedProduct.price)}) ändern?`} run={change} show={showConfirmChange} setShow={setShowConfirmChange} /> :
            <Card.Body>
                <ProductSelect runCallback={setProduct} resetCallback={resetAll} setResetCallback={setResetCallback} useReset hideReset onlyActive={false} />
                <Collapse in={updatedProduct!=null}>
                    <div>
                        {updatedProduct && changeProductUi()} 
                    </div>
                </Collapse>
            </Card.Body>}
        </Card>
        </div>
    );
}