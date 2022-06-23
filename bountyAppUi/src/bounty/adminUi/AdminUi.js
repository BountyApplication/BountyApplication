import React from 'react';
import { Navbar, Nav, Container, Tabs, Tab, Row, Col, Button } from 'react-bootstrap';
import {Link} from "react-router-dom";
import AddProduct from './AddProduct';
import AddUser from './AddUser';
import ChangeProduct from './ChangeProduct';
import ChangeUser from './ChangeUser';
import RemoveProduct from './RemoveProduct';
import RemoveUser from './RemoveUser';
import { useLocation } from 'react-router-dom';

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
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <Tabs  defaultActiveKey="addUser" id="noanim-tab-example" className="mb-3">
            <Tab eventKey="addUser" title="Add User">
                <AddUser />
            </Tab>
            <Tab eventKey="removeUser" title="Remove User">
                <RemoveUser />
            </Tab>
            <Tab eventKey="changeUser" title="Change User">
                <ChangeUser />
            </Tab>

            <Tab eventKey="addPrdouct" title="Add Product">
                <AddProduct />
            </Tab>
            <Tab eventKey="removeProduct" title="Remove Product">
                <RemoveProduct />
            </Tab>
            <Tab eventKey="changeProduct" title="Change Product">
                <ChangeProduct />
            </Tab>
        </Tabs>
        <Tab.Container id="left-tabs-example" defaultActiveKey="addUser">
  <Row>
    <Col sm={3}>
      <Nav variant="pills" className="flex-column">
        <Nav.Item>
          <Nav.Link eventKey="addUser">add User</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="removeUser">remove User</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="changeUser">change User</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="addProduct">add Product</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="removeProduct">remove Product</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="changeProduct">change Product</Nav.Link>
        </Nav.Item>
      </Nav>
    </Col>
    <Col sm={9}>
      <Tab.Content>
        <Tab.Pane eventKey="addUser">
          <AddUser />
        </Tab.Pane>
        <Tab.Pane eventKey="removeUser">
          <RemoveUser />
        </Tab.Pane>
        <Tab.Pane eventKey="changeUser">
          <ChangeUser />
        </Tab.Pane>
        <Tab.Pane eventKey="addProduct">
          <AddProduct />
        </Tab.Pane>
        <Tab.Pane eventKey="removeProduct">
          <RemoveProduct />
        </Tab.Pane>
        <Tab.Pane eventKey="changeProduct">
          <ChangeProduct />
        </Tab.Pane>
      </Tab.Content>
    </Col>
  </Row>
</Tab.Container>
            <Link to="/">{"back"}</Link><br />
            
            
        </div>
        
    );
}