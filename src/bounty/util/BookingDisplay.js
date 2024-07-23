import React, { useState } from 'react';
import {Table, Collapse, Container, Button} from 'react-bootstrap';
import RowText from './RowText';
import {toCurrency} from './Util';
import Confirm from './Confirm';
import { commitBooking, getUserBalance } from './Database';

export function ProductList({className, products, allProducts, setProducts, isHistory}) {

    // var count = 1;
    return(
        <Table striped hover size="sm" className={className}>
            <thead className='d-sticky'>
                <tr>
                    {/* <th>#</th> */}
                    <th>Produkt</th>
                    <th>Stück</th>
                    <th>Preis</th>
                    <th>Summe</th>
                </tr>
            </thead>
            <tbody>
                {products!=null && products.map(({productId, name, price, amount}) => 
                    <tr key={productId}>
                        {/* <td>{count++}</td> */}
                        <td>{name}</td>
                        <td>{amount}{!isHistory&&<Button variant="primary" className='ms-3 px-2 pb-1 pt-0' onClick={()=>setProducts(allProducts.map((product) => product.productId!==productId?{...product}:{...product, amount: amount-1}))}>-</Button>}</td>
                        <td>{`${price.toFixed(2)}€`}</td>
                        <td>{`${(price*amount).toFixed(2)}€`}{!isHistory&&<Button variant="danger" className='ms-3 px-2 pb-1 pt-0' onClick={()=>setProducts(allProducts.map((product) => product.productId!==productId?{...product}:{...product, amount: 0}))}>X</Button>}</td>
                    </tr>
                )}
            </tbody>
        </Table>
    )
}

export default function BookingDisplay({children, booking: {oldBalance, newBalance, total, productSum, correction, cashPayment, products}, allProducts, setProducts, isHistory = false, userId = null}) {
    const labelText = "fs-4 px-0";
    const labelTextImportant = "fs-4 fw-bold px-0";
    const hasInput = (newBalance!==oldBalance || correction!==0 || cashPayment!==0)
    const ref = React.createRef();

    const [showConfirm, setShowConfirm] = useState(false);

    function run({balance}) {
        if(!userId) return;
    
        let reversedProducts = products.map(product => ({...product, amount: -product.amount}));
        let updatedBalance = Math.round((balance+oldBalance-newBalance)*100)/100;
        let reversedBooking = {oldBalance: balance, newBalance: updatedBalance, total: -total, productSum: -productSum, correction: -correction, cashPayment: -cashPayment, products: reversedProducts};
        commitBooking(userId, reversedBooking);
    }

    return(
    <Container className="d-flex h-100 align-items-center flex-column">
        {showConfirm ? <Confirm text={`Willst du wirklich die Buchung in der Höhe ${productSum} ${correction!==0||cashPayment!==0?' - '+correction+cashPayment+' ':''}€ rückgängig machen?`} run={() => getUserBalance(userId, run)} show={showConfirm} setShow={setShowConfirm} danger /> :
        <><Collapse in={oldBalance!=null}><RowText ref={ref} className={labelTextImportant} left={isHistory?'Guthaben vorher':'Guthaben'} right={toCurrency(oldBalance)} /></Collapse>
        <Collapse in={products!=null&&products.length!==0}><div className='overflow-auto w-100'><ProductList className="mt-3" products={products.filter(({amount}) => amount!==0)} allProducts={allProducts} setProducts={setProducts} isHistory={isHistory} /></div></Collapse>
        <div className="mb-auto w-100" />
        <Collapse in={productSum!==0}><RowText ref={ref} className={labelTextImportant} left={'Summe'} right={toCurrency(productSum)} /></Collapse>
        <Collapse in={correction!==0}><RowText ref={ref} className={labelText} left={'Korrektur'} right={toCurrency(correction)} /></Collapse>
        <Collapse in={cashPayment!==0}><RowText ref={ref} className={labelText} left={'Barzahlung'} right={toCurrency(cashPayment)} /></Collapse>
        {children}
        <Collapse in={hasInput}><RowText ref={ref} className={labelTextImportant} left={isHistory?'Guthaben nachher':'Neu'} right={toCurrency(newBalance)} /></Collapse>
        {isHistory&&userId&&<Button variant="danger" className='ms-3 px-2 pb-1 pt-0' onClick={() => setShowConfirm(true)}>Buchung Rückgängig machen</Button>}</>}
    </Container>);
}