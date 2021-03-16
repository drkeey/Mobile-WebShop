import React from "react";

import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { Container } from "react-bootstrap";

const CryptoJS = require("crypto-js");


export default function Registracija() {
    const [registerResponse, setRegisterResponse] = React.useState()
  
    const [loading, setLoading] = React.useState(false)
    const [podaci, setPodaci] = React.useState({
      korisnicko_ime: '',
      lozinka: '',
      email: ''
    })
  
    const submitHandler = event => {
      event.preventDefault();
      event.target.className += " was-validated";

      setLoading(true)
      //console.log(podaci, event.target)
      //Registracija
      
      let podaci_clone = Object.assign({}, podaci)
      podaci_clone.lozinka = CryptoJS.AES.encrypt(podaci.lozinka, '123').toString()

      let xmlhttp = new XMLHttpRequest()
      xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          //console.log(this.responseText);
          setLoading(false)
          return setRegisterResponse(this.responseText)
        }
        setRegisterResponse(this.responseText)
        setLoading(false)
      };
      xmlhttp.open("POST", "http://localhost:4000/registracija", true);
      xmlhttp.setRequestHeader('Content-type', 'application/json')
      //console.log(podaci)
      xmlhttp.send(
        JSON.stringify(
          podaci_clone
        )
      );
    };
  
    const changeHandler = event => {
      event.target.value = event.key
      setPodaci(Object.assign(podaci, { [event.target.name]: event.target.value }));
      //console.log(event.target.name, event.target.value, '     ', podaci)
    };
  
    return (
      <Container fluid>
        <h1 style={{ textAlign: 'center' }}>Registracija</h1>
        <div style={{ margin: 'auto', width: '30%', textAlign: 'center' }}>
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="registracija.korisnicko_ime">
              <Form.Label>Korisničko ime</Form.Label>
              <InputGroup className="mb-3">
                <FormControl
                  name="korisnicko_ime"
                  type="text"
                  required
                  onChange={changeHandler}
                  maxLength="20"
                />
              </InputGroup>
            </Form.Group>
            <Form.Group controlId="registracija.lozinka">
              <Form.Label>Lozinka</Form.Label>
              <InputGroup className="mb-3">
                <FormControl
                  name="lozinka"
                  type="password"
                  required
                  onChange={changeHandler}
                  maxLength="25"
                />
              </InputGroup>
            </Form.Group>
            <Form.Group controlId="registracija.potvrdaLozinke">
              <Form.Label>Potvrdi lozinku</Form.Label>
              <InputGroup className="mb-3">
                <FormControl
                  name="PasswordConfirm"
                  type="password"
                  required
                  onChange={changeHandler}
                  maxLength="25"
                />
              </InputGroup>
            </Form.Group>
            <Form.Group controlId="registracija.email">
              <Form.Label>Email</Form.Label>
              <InputGroup className="mb-3">
                <FormControl
                  name="email"
                  type="email"
                  required
                  onChange={changeHandler}
                  maxLength="50"
                />
              </InputGroup>
            </Form.Group>
            <Button type="submit" style={{ marginTop: '5px' }} variant="outline-dark">Registracija</Button>
            <br />
            {loading ? <Spinner style={{ marginTop: '5px' }} animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner> : null}
            <a>{registerResponse}</a>
          </Form>
        </div>
  
      </Container>
    )
  }