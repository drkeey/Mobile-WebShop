import React from "react"
import { useHistory } from "react-router-dom";
import {
  Redirect
} from "react-router-dom";

import Cookies from 'js-cookie';
import { Container } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

const CryptoJS = require("crypto-js");


export default function Prijava() {
    const [loading, setLoading] = React.useState(false)
    const [loginResponse, setLoginResponse] = React.useState()
    const history = useHistory();
    const [podaci, setPodaci] = React.useState({
      korisnicko_ime: '',
      lozinka: ''
    })
  
    const submitHandler = event => {
      event.preventDefault();
      event.target.className += " was-validated";
  
      setLoading(true)
      console.log(podaci, event.target)
      //Prijava
      let xmlhttp = new XMLHttpRequest()
      xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          console.log(this.responseText);
          setLoginResponse(this.responseText)
          setLoading(false)
          let token = this.responseText.replaceAll(`"`, '')
          Cookies.set('token', token)
          alert('Uspješno logiran')
          return history.push('/')
        }
        switch (this.status) {
          case 404:
            setLoginResponse('Neuspješna prijava.')
            setLoading(false)
            break;
        }
      };
      xmlhttp.open("POST", "http://localhost:4000/prijava", true);
      xmlhttp.setRequestHeader('Content-type', 'application/json')
      console.log(podaci)
      xmlhttp.send(
        JSON.stringify(
          {
            korisnicko_ime: podaci.korisnicko_ime,
            lozinka: CryptoJS.AES.encrypt(podaci.lozinka, '123').toString()
          }
        )
      );
    };
  
    const changeHandler = event => {
      setPodaci(Object.assign(podaci, { [event.target.name]: event.target.value }));
      console.log(event.target.name, event.target.value, '     ', podaci)
    };
  
    return (
      <Container fluid>
        <h1 style={{ textAlign: 'center' }}>Prijava</h1>
        <div style={{ margin: 'auto', width: '30%', textAlign: 'center' }}>
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="prijava.korisnicko_ime">
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
            <Form.Group controlId="prijava.lozinka">
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
            <Button type="submit" variant="outline-dark">Prijava</Button> <br />
            <br />
            {loading ? <Spinner style={{ marginTop: '5px' }} animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner> : null}
            <a>{loginResponse}</a>
          </Form>
        </div>
  
      </Container>
    )
  }