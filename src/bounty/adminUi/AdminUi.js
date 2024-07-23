import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import {Link} from "react-router-dom";
import AddProduct from './AddProduct';
import AddUser from './AddUser';
import ChangeProduct from './ChangeProduct';
import ChangeUser from './ChangeUser';
import RemoveProduct from './RemoveProduct';
import RemoveUser from './RemoveUser';
import { useLocation } from 'react-router-dom';
import ArrangeProduct from './ArrangeProduct';

export default function AdminUi(props) {

    const location = useLocation();
    const params = new URLSearchParams(location.hash);

    return(
        <div className="main">
        <Navbar bg="light" expand="lg">
        <Container>
            <Navbar.Brand href="#home">Admin Ui</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto" variant="tabs">
                    <Nav.Item><Nav.Link href="#addUser">add User</Nav.Link></Nav.Item>
                    <Nav.Item><Nav.Link href="#removeUser">remove User</Nav.Link></Nav.Item>
                    <Nav.Item><Nav.Link href="#changeUser">change User</Nav.Link></Nav.Item>
                    <Nav.Item><Nav.Link href="#addProduct">add Product</Nav.Link></Nav.Item>
                    <Nav.Item><Nav.Link href="#removeProduct">remove Product</Nav.Link></Nav.Item>
                    <Nav.Item><Nav.Link href="#changeProduct">change Product</Nav.Link></Nav.Item>
                    <Nav.Item><Nav.Link href="#arrangeProduct">arrange Product</Nav.Link></Nav.Item>
                    <Nav.Item><Button variant="outline-primary"><Link color="warning" to="/">back</Link></Button></Nav.Item>
                </Nav>
            </Navbar.Collapse>
        </Container>
        </Navbar>
        {params.has("#addUser") && <AddUser />}
        {params.has("#removeUser") && <RemoveUser />}
        {params.has("#changeUser") && <ChangeUser />}
        {params.has("#addProduct") && <AddProduct />}
        {params.has("#removeProduct") && <RemoveProduct />}
        {params.has("#changeProduct") && <ChangeProduct />}      
        {params.has("#arrangeProduct") && <ArrangeProduct />}      
      </div>  
    );
}