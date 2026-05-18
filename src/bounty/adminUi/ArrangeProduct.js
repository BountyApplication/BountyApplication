import React from 'react';
import { changeProduct, useGetProducts } from '../util/Database';
import {Form, Button, Card, Table} from 'react-bootstrap';

export default function ArrangeProduct() {
    // vars
    const products = useGetProducts(null, false);

    function getProduct(_place) {
        return products.find(({place}) => place === _place);
    }

    function moveUp(place) {
        if(place === 0) return;
        let productUp = getProduct(place);
        let productDown = getProduct(place-1);
        productUp.place = place-1;
        productDown.place = place;
        changeProduct(productUp);
        changeProduct(productDown);
    }

    function moveDown(place) {
        if(place === products.length-1) return;
        let productDown = getProduct(place);
        let productUp = getProduct(place+1);
        productDown.place = place+1;
        productUp.place = place;
        changeProduct(productDown);
        changeProduct(productUp);
    }

    function arrangeProductUi() {
        return(
            <Form>
                <Table striped hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Product</th>
                            <th className=''>Move</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(({place, name, active}) =>
                            <tr key={place}>
                                <td>{place}</td>
                                <td className={active!==1?'fw-light fst-italic':''}>{name}</td>
                                <td><Button onClick={moveUp.bind(null, place)} className='me-2'>  <i className="bi bi-arrow-up">  </i></Button>
                                    <Button onClick={moveDown.bind(null, place)} >                <i className="bi bi-arrow-down"></i></Button></td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </Form>
        );
    }

    return(
        <div className='d-flex justify-content-center'>
        <Card className='w-auto mt-3' style={{minWidth: 38+'%'}}>
            <Card.Header>
                <Card.Title>Produkte neu Anordnen</Card.Title>
            </Card.Header>
            <Card.Body>
                {arrangeProductUi()}
            </Card.Body>
        </Card>
        </div>
    );
}