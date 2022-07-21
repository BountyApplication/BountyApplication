import React from 'react';
import {Table, Collapse, Container} from 'react-bootstrap';
import RowText from './RowText';
import {toCurrency} from './Util';

export function ProductList({className, products}) {
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
                        <td>{amount}</td>
                        <td>{`${price.toFixed(2)}€`}</td>
                        <td>{`${(price*amount).toFixed(2)}€`}</td>
                    </tr>
                )}
            </tbody>
        </Table>
    )
}

export default function BookingDisplay({children, booking: {oldBalance, newBalance, productSum, correction, cashPayment, products}, isHistory = false}) {
    const labelText = "fs-4 px-0";
    const labelTextImportant = "fs-4 fw-bold px-0";
    const hasInput = (newBalance!==oldBalance || correction!==0 || cashPayment!==0)
    const ref = React.createRef();
    return <Container className="d-flex h-100 align-items-center flex-column">
        <Collapse in={oldBalance!=null}><RowText ref={ref} className={labelTextImportant} left={isHistory?'Guthaben vorher':'Guthaben'} right={toCurrency(oldBalance)} /></Collapse>
        <Collapse in={products!=null&&products.length!==0}><div className='overflow-auto w-100'><ProductList className="mt-3" products={products.filter(({amount}) => amount!==0) } /></div></Collapse>
        <div className="mb-auto w-100" />
        <Collapse in={productSum!==0}><RowText ref={ref} className={labelTextImportant} left={'Summe'} right={toCurrency(productSum)} /></Collapse>
        <Collapse in={correction!==0}><RowText ref={ref} className={labelText} left={'Korrektur'} right={toCurrency(correction)} /></Collapse>
        <Collapse in={cashPayment!==0}><RowText ref={ref} className={labelText} left={'Barzahlung'} right={toCurrency(cashPayment)} /></Collapse>
        {children}
        <Collapse in={hasInput}><RowText ref={ref} className={labelTextImportant} left={isHistory?'Guthaben nachher':'Neu'} right={toCurrency(newBalance)} /></Collapse>
    </Container>
}