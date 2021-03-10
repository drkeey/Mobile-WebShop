
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { FaCartPlus } from "react-icons/fa";
import Form from 'react-bootstrap/Form';


import Cookies from 'js-cookie';

function Kosarica() {
    const [kosara, addToKosara] = React.useState()
    // const handleSetKorpa = (itemi) => {
    //   console.log('halooo')
    //   let found = mobiteli.map()
    //   setKorpa(itemi)
    // }
    // useEffect(() => {
    //   localStorage.setItem('kosarica', JSON.stringify([0]))
    //   console.log('b', localStorage.getItem('kosarica'))
    //   // Run! Like go get some data from an API.
    //   let timer = setInterval(() => {
    //     console.log('a', localStorage.getItem('kosarica'))
    //     let parsed = localStorage.getItem('kosarica')
    //     if (parsed) return handleSetKorpa(parsed)

    //   }, 1000)
    // }, []);

    return (
        <NavDropdown title={<FaCartPlus />} id="basic-nav-dropdown">
            {/* {korpa.forEach(mobitel => {
        (
          <div>
            <NavDropdown.Item href="#action/3.4">
              <img src={mobitel.slikaUrl} style={{ width: '100px', height: '100px' }} alt="Avatar" />
              <a>{mobitel.naziv}</a>
              <b> (1 komad)</b>
              <br /><b>{`Cijena: ${mobitel.cijena} HRK`}</b>
            </NavDropdown.Item>
          </div>
        )
      })} */}

            <NavDropdown.Item href="#action/3.4" href="/kosara">Pregled košare</NavDropdown.Item>
        </NavDropdown>
    )
}

export default function NavigationBar(props) {
    const history = useHistory();
    console.log(props.isLogged)


    function handleLogOut() {
        Cookies.set('token', '')
        Cookies.set('loggedIn', false)
        console.log('logo')
        history.push("/");
    }


    // if (!loggedIn) return <a>Loading...</a>

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

                        {/* <NavDropdown.Divider /> */}
                        {/* <NavDropdown.Item href="/resetLozinke">Zaboravljena lozinka</NavDropdown.Item> */}
                    </NavDropdown>
                    <Kosarica />
                </Nav>
                <Form inline>

                </Form>
            </Navbar.Collapse>
        </Navbar>
    )
}

