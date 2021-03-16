
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { FaCartPlus } from "react-icons/fa";
import Form from 'react-bootstrap/Form';


import Cookies from 'js-cookie';


export default function NavigationBar(props) {
    const history = useHistory();
    //console.log(props.isLogged)

    function handleLogOut() {
        Cookies.remove('token')
        Cookies.remove('loggedIn')
        history.push("/");
    }

    return (
        <Navbar className="navbar" bg="light" expand="lg">
            <Navbar.Brand href="/">E-Mobiteli</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link href="/uredaji">Uređaji</Nav.Link>
                    <NavDropdown title="Profil" id="basic-nav-dropdown">
                        {props.isLogged ?
                            <div>
                                <NavDropdown.Item href="/profil">Pregled profila</NavDropdown.Item>
                                <NavDropdown.Item href="/" onClick={handleLogOut}>Odjava</NavDropdown.Item>
                            </div>
                            :
                            <div>
                                <NavDropdown.Item href="/prijava">Prijava</NavDropdown.Item>
                                <NavDropdown.Item href="/registracija">Registracija</NavDropdown.Item>
                            </div>
                        }
                    </NavDropdown>
                    {props.isLogged ? <Nav.Link href="/kosara">{<FaCartPlus />}</Nav.Link> : null }
                </Nav>
                <Form inline>

                </Form>
            </Navbar.Collapse>
        </Navbar>
    )
}

