import React, {useState, useEffect} from 'react';
import ProductSelect from '../util/ProductSelect';
import { changeProduct } from '../util/Database';
import {Form, Button, Collapse, Card} from 'react-bootstrap';
import Input from '../util/Input';
import { toCurrency } from '../util/Util.js';

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
        if(window.confirm(`Change Product ${product.name} (${toCurrency(product.price)}) to ${updatedProduct.name} (${toCurrency(updatedProduct.price)}) ?`)) {
            console.log(updatedProduct);
            changeProduct(product, updatedProduct);

        if(resetCallback)
            resetCallback();
        }
    }

    function changeProductUi() {
        return(
            <Card>
                <Card.Header>
                    <Card.Title>Produkt Bearbeiten</Card.Title>
                </Card.Header>
                <Card.Body>
                <Form>
                    <Input title="Name" value={updatedProduct.name} setValue={name => setUpdatedProduct({...updatedProduct, name: name})} />
                    <Input type="number" title="Preis" value={updatedProduct.price} setValue={price => setUpdatedProduct({...updatedProduct, price: price})} />
                    <div className="form-check form-switch w-100 d-flex justify-content-left ps-0 mb-3">
                        <label className="form-check-label fs-5 ms-3" htmlFor="flexSwitchCheckChecked">Aktiv:</label>
                        <input className="form-check-input d-inline float-end ms-3" style={{height: '1.6rem', width: '3.2rem'}} type="checkbox" checked={updatedProduct.active===1} onChange={()=>{setUpdatedProduct({...updatedProduct, active: (updatedProduct.active?0:1)});}}></input>
                    </div>
                    
                    <Collapse in={updatedProduct!==product}>
                        <div>
                            <Button variant="secondary" type="reset" className='mb-2' onClick={reset.bind(this)}>{"reset"}</Button>
                            <Button type="submit" className='ms-2 mb-2' onClick={submit.bind(this)}>{"submit"}</Button>
                        </div>
                    </Collapse>
                </Form>
                </Card.Body>
            </Card>
        );
    }

    return(
        <Card>
            <Card.Header>
                <Card.Title>Produkt Bearbeiten</Card.Title>
            </Card.Header>
            <Card.Body>
                <ProductSelect runCallback={setProduct} resetCallback={resetAll} setResetCallback={setResetCallback} useReset={true} hideReset={true} onlyActive={false} />
                <Collapse in={updatedProduct!=null}>
                    <div>
                        {updatedProduct && changeProductUi()} 
                    </div>
                </Collapse>
            </Card.Body>
        </Card>
    );
}