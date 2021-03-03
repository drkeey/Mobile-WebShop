import React, { useEffect } from "react";

import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { Container } from "react-bootstrap";


import Cookies from 'js-cookie';
var jwt = require('jsonwebtoken');

function AdminPloca() {
    const [users, setUsers] = React.useState(null)
    const [oznaceni, setOznaceni] = React.useState(Array)
  
    const [modalShowUredi, setModalShowUredi] = React.useState(false)
    const [modalShowUrediTip, setModalShowUrediTip] = React.useState(false)
  
    const [odabraniKorisnik, setOdabraniKorisnik] = React.useState('')
  
  
    useEffect(async () => {
      let xmlhttp = new XMLHttpRequest()
      xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          let parsed = JSON.parse(this.responseText)
          const decoded = jwt.verify(Cookies.get('token'), '123')  
          let filtered = parsed.filter(elem => elem.tip !== 0)
          if (decoded.tip !== 0) return setUsers(filtered) //Ako je moderator u pitanju, onda saljemo sve korisnicke racune osim adminovog
          setUsers(parsed)
        }
      };
      xmlhttp.open("GET", "http://localhost:4000/adminPloca", true);
      xmlhttp.setRequestHeader(`Authorization`, `Bearer ${Cookies.get('token')}`)
      xmlhttp.send();
  
    }, []);
  
    const tipSwitch = (param) => {
      switch (param) {
        case 0:
          return <a>Admin</a>;
        case 1:
          return <a>Moderator</a>;
        case 2:
          return <a>Korisnik</a>;
      }
    }
  
    function handleCheckBox(event, user) {
      if (event.currentTarget.checked) {
        let copy = oznaceni.map(el => el)
        copy.push(user)
        setOznaceni(copy)
        console.log(oznaceni, copy)
      }
      else {
        let copy = oznaceni.filter(el => el !== user)
        setOznaceni(copy)
        console.log(copy)
      }
  
    }
  
    //Tip
    function urediTipKorisnika_handler() {
      setOdabraniKorisnik(oznaceni[0])
      setModalShowUrediTip(true)
    }
    function ModalUrediTip() {
      const [korisnik, setKorisnik] = React.useState(odabraniKorisnik)
      const [korisnikUpdate, setKorisnikUpdate] = React.useState(Object.assign({}, odabraniKorisnik))
  
      const [loading, setLoading] = React.useState(false)
      const [loginResponse, setLoginResponse] = React.useState()
  
      const submitHandler = event => {
        event.preventDefault();
        event.target.className += " was-validated";
        setLoading(true)
        //Prijava
        let xmlhttp = new XMLHttpRequest()
        console.log(korisnikUpdate)
        xmlhttp.onreadystatechange = function () {
          if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            setLoading(false)
            setLoginResponse(this.responseText)
          }
        };
        xmlhttp.open("POST", "http://localhost:4000/urediTip", true);
        xmlhttp.setRequestHeader(`Authorization`, `Bearer ${Cookies.get('token')}`)
        xmlhttp.setRequestHeader('Content-type', 'application/json')
        xmlhttp.send(
          JSON.stringify(
            korisnikUpdate
          )
        );
      };
  
  
  
      const changeHandler = event => {
        setKorisnikUpdate(Object.assign(korisnikUpdate, { [event.target.name]: parseInt(event.target.value) }));
        console.log(event.target.name, event.target.value, '     ', korisnikUpdate)
      };
  
  
  
      //if (!odabraniKorisnik) return <a>Loading...</a>
      return (
        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={modalShowUrediTip}
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Uređivanje tipa
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form >
              <Form.Group controlId="prijava.korisnicko_ime">
                <Form.Label>{`Korisničko ime`}</Form.Label>
                <InputGroup className="mb-3">
                  <FormControl
                    name="korisnicko_ime"
                    type="text"
                    value={korisnik.korisnicko_ime}
                    disabled
                  />
                </InputGroup>
              </Form.Group>
              <Form.Group controlId="prijava.tip">
                <Form.Label>{`Trenutni tip`}</Form.Label>
                <InputGroup className="mb-3">
                  <FormControl
                    name="tip"
                    type="text"
                    value={korisnik.tip}
                    disabled
                  />
                </InputGroup>
              </Form.Group>
              <Form.Group controlId="exampleForm.SelectCustom">
                <Form.Label>Novi tip</Form.Label>
                <Form.Control as="select"
                  name="tip"
                  onChange={(e) => changeHandler(e)}
                  custom>
                  <option value={0}>0 - Admin</option>
                  <option value={1}>1 - Moderator</option>
                  <option value={2}>2 - Korisnik</option>
                </Form.Control>
              </Form.Group>
  
              <br />
            </Form>
          </Modal.Body>
          <Modal.Footer>
            {loading ? <Spinner style={{ marginTop: '5px' }} animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner> : null}
            <a>{loginResponse}</a>
            <Button onClick={(e) => submitHandler(e)} variant="outline-dark">Ažuriraj</Button> <br />
            <Button variant="outline-danger" onClick={() => setModalShowUrediTip(false)}>Zatvori</Button>
          </Modal.Footer>
        </Modal>
      );
    }
    //Uredi
    function urediKorisnika_handler() {
      setOdabraniKorisnik(oznaceni[0])
      setModalShowUredi(true)
    }
    function ModalUredi() {
      const [korisnik, setKorisnik] = React.useState(odabraniKorisnik)
      const [korisnikUpdate, setKorisnikUpdate] = React.useState(Object.assign({}, odabraniKorisnik))
  
      const [loading, setLoading] = React.useState(false)
      const [loginResponse, setLoginResponse] = React.useState()
  
      const submitHandler = event => {
        event.preventDefault();
        event.target.className += " was-validated";
        setLoading(true)
        //Prijava
        let xmlhttp = new XMLHttpRequest()
        xmlhttp.onreadystatechange = function () {
          if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            setLoading(false)
            setLoginResponse(this.responseText)
          }
        };
        xmlhttp.open("POST", "http://localhost:4000/uredi", true);
        xmlhttp.setRequestHeader(`Authorization`, `Bearer ${Cookies.get('token')}`)
        xmlhttp.setRequestHeader('Content-type', 'application/json')
        xmlhttp.send(
          JSON.stringify(
            korisnikUpdate
          )
        );
      };
  
  
  
      const changeHandler = event => {
        setKorisnikUpdate(Object.assign(korisnikUpdate, { [event.target.name]: event.target.value }));
        console.log(event.target.name, event.target.value, '     ', korisnikUpdate)
      };
  
  
  
      //if (!odabraniKorisnik) return <a>Loading...</a>
      return (
        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={modalShowUredi}
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Uređivanje
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
  
            <Form >
              <Form.Group controlId="prijava.korisnicko_ime">
                <Form.Label>{`Korisničko ime - ${korisnik.korisnicko_ime}`}</Form.Label>
                <InputGroup className="mb-3">
                  <FormControl
                    name="korisnicko_ime"
                    type="text"
                    required
                    onChange={(e) => changeHandler(e)}
                    maxLength="20"
                  />
                </InputGroup>
              </Form.Group>
              <Form.Group controlId="prijava.lozinka">
                <Form.Label>{`Lozinka - ${korisnik.lozinka}`}</Form.Label>
                <InputGroup className="mb-3">
                  <FormControl
                    name="lozinka"
                    type="password"
                    required
                    onChange={(e) => changeHandler(e)}
                    maxLength="25"
                  />
                </InputGroup>
              </Form.Group>
              <Form.Group controlId="prijava.email">
                <Form.Label>{`Email - ${korisnik.email}`}</Form.Label>
                <InputGroup className="mb-3">
                  <FormControl
                    name="email"
                    type="email"
                    required
                    onChange={(e) => changeHandler(e)}
                    maxLength="25"
                  />
                </InputGroup>
              </Form.Group>
              <Form.Group controlId="prijava.ime">
                <Form.Label>{`Ime - ${korisnik.ime}`}</Form.Label>
                <InputGroup className="mb-3">
                  <FormControl
                    name="ime"
                    type="text"
                    required
                    onChange={(e) => changeHandler(e)}
                    maxLength="25"
                  />
                </InputGroup>
              </Form.Group>
              <Form.Group controlId="prijava.prezime">
                <Form.Label>{`Prezime - ${korisnik.prezime}`}</Form.Label>
                <InputGroup className="mb-3">
                  <FormControl
                    name="prezime"
                    type="text"
                    required
                    onChange={(e) => changeHandler(e)}
                    maxLength="25"
                  />
                </InputGroup>
              </Form.Group>
              <Form.Group controlId="prijava.adresa">
                <Form.Label>{`Adresa - ${korisnik.adresa}`}</Form.Label>
                <InputGroup className="mb-3">
                  <FormControl
                    name="adresa"
                    type="text"
                    required
                    onChange={(e) => changeHandler(e)}
                    maxLength="25"
                  />
                </InputGroup>
              </Form.Group>
              <Form.Group controlId="prijava.opcina">
                <Form.Label>{`Opcina - ${korisnik.opcina}`}</Form.Label>
                <InputGroup className="mb-3">
                  <FormControl
                    name="opcina"
                    type="text"
                    required
                    onChange={(e) => changeHandler(e)}
                    maxLength="25"
                  />
                </InputGroup>
              </Form.Group>
              <Form.Group controlId="prijava.postanski_broj">
                <Form.Label>{`Poštanski broj - ${korisnik.postanski_broj}`}</Form.Label>
                <InputGroup className="mb-3">
                  <FormControl
                    name="postanski_broj"
                    type="text"
                    required
                    onChange={(e) => changeHandler(e)}
                    maxLength="25"
                  />
                </InputGroup>
              </Form.Group>
              <br />
            </Form>
          </Modal.Body>
          <Modal.Footer>
            {loading ? <Spinner style={{ marginTop: '5px' }} animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner> : null}
            <a>{loginResponse}</a>
            <Button onClick={(e) => submitHandler(e)} variant="outline-dark">Ažuriraj</Button> <br />
            <Button variant="outline-danger" onClick={() => setModalShowUredi(false)}>Zatvori</Button>
          </Modal.Footer>
        </Modal>
      );
    }
    //Brisanje
    function obrisiKorisnika_handler() {
      const korisnici_za_obrisat = oznaceni.map(el => el.ID)
      let xmlhttp = new XMLHttpRequest()
      xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          alert('Uspješno obrisano.');
          window.location.reload(false);
  
        }
      };
      xmlhttp.onerror = function (err) {
        alert('Greška');
      }
      xmlhttp.open("POST", "http://localhost:4000/obrisi", true);
      xmlhttp.setRequestHeader(`Authorization`, `Bearer ${Cookies.get('token')}`)
      xmlhttp.setRequestHeader('Content-type', 'application/json')
      console.log(korisnici_za_obrisat)
      xmlhttp.send(
        JSON.stringify(
          korisnici_za_obrisat
        )
      );
    }
  
  
    //Buttoni
    function Controlls() {
      if (oznaceni.length > 1) {
        return (
          <div>
            <Button disabled block style={{ marginTop: '2rem' }} variant="outline-dark">Uredi</Button>
            <Button disabled block style={{ marginTop: '5px' }} variant="outline-primary">Tip</Button>
            <Button onClick={() => obrisiKorisnika_handler()} block style={{ marginTop: '5px' }} variant="danger">Obriši</Button>
          </div>
        )
      }
      if (oznaceni.length === 0) {
        return (
          <div>
            <Button disabled block style={{ marginTop: '2rem' }} variant="outline-dark">Uredi</Button>
            <Button disabled block style={{ marginTop: '5px' }} variant="outline-primary">Tip</Button>
            <Button disabled block style={{ marginTop: '5px' }} variant="outline-danger">Obriši</Button>
          </div>
        )
      }
      else {
        return (
          <div>
            <Button onClick={() => urediKorisnika_handler()} block style={{ marginTop: '2rem' }} variant="dark">Uredi</Button>
            <Button onClick={() => urediTipKorisnika_handler()} block style={{ marginTop: '5px' }} variant="primary">Tip</Button>
            <Button onClick={() => obrisiKorisnika_handler()} block style={{ marginTop: '5px' }} variant="danger">Obriši</Button>
          </div>
        )
      }
    }
  
    const [showDodajKorisnika, setShowDodajKorisnika] = React.useState(true)
    const [responseText, setResponseText] = React.useState('')
  
    //Dodaj korisnika
    function DodajKorisnika() {
      const [korisnik, setKorisnik] = React.useState({
        tip: '',
        korisnicko_ime: '',
        lozinka: '',
        email: '',
        ime: '',
        prezime: '',
        adresa: '',
        opcina: '',
        postanski_broj: ''
      })
  
      const [loading, setLoading] = React.useState(false)
      const [loginResponse, setLoginResponse] = React.useState()
  
  
      const submitHandler = event => {
        event.preventDefault();
        event.target.className += " was-validated";
        setLoading(true)
        //Prijava
        let xmlhttp = new XMLHttpRequest()
        xmlhttp.onreadystatechange = function () {
          if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            setResponseText(this.responseText)
          }
        };
        xmlhttp.open("POST", "http://localhost:4000/dodajKorisnika", true);
        xmlhttp.setRequestHeader(`Authorization`, `Bearer ${Cookies.get('token')}`)
        xmlhttp.setRequestHeader('Content-type', 'application/json')
        xmlhttp.send(
          JSON.stringify(
            korisnik
          )
        );
      };
  
  
  
      const changeHandler = event => {
        let obj = Object.assign(korisnik, { [event.target.name]: event.target.value })
        setKorisnik(obj);
        console.log(event.target.name, event.target.value, '     ', obj)
      };
  
      return (
        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={showDodajKorisnika}
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Dodavanje novog korisnika
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form >
              <Form.Group controlId="exampleForm.SelectCustom">
                <Form.Label>Tip</Form.Label>
                <Form.Control as="select"
                  name="tip"
                  onChange={(e) => changeHandler(e)}
                  custom>
                  <option value={0}>0 - Admin</option>
                  <option value={1}>1 - Moderator</option>
                  <option value={2}>2 - Korisnik</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="prijava.korisnicko_ime">
                <Form.Label>{`Korisničko ime`}</Form.Label>
                <InputGroup className="mb-3">
                  <FormControl
                    name="korisnicko_ime"
                    type="text"
                    required
                    onChange={(e) => changeHandler(e)}
                    maxLength="20"
                  />
                </InputGroup>
              </Form.Group>
              <Form.Group controlId="prijava.lozinka">
                <Form.Label>{`Lozinka`}</Form.Label>
                <InputGroup className="mb-3">
                  <FormControl
                    name="lozinka"
                    type="password"
                    required
                    onChange={(e) => changeHandler(e)}
                    maxLength="25"
                  />
                </InputGroup>
              </Form.Group>
              <Form.Group controlId="prijava.email">
                <Form.Label>{`Email`}</Form.Label>
                <InputGroup className="mb-3">
                  <FormControl
                    name="email"
                    type="email"
                    required
                    onChange={(e) => changeHandler(e)}
                    maxLength="25"
                  />
                </InputGroup>
              </Form.Group>
              <Form.Group controlId="prijava.ime">
                <Form.Label>{`Ime`}</Form.Label>
                <InputGroup className="mb-3">
                  <FormControl
                    name="ime"
                    type="text"
                    required
                    onChange={(e) => changeHandler(e)}
                    maxLength="25"
                  />
                </InputGroup>
              </Form.Group>
              <Form.Group controlId="prijava.prezime">
                <Form.Label>{`Prezime`}</Form.Label>
                <InputGroup className="mb-3">
                  <FormControl
                    name="prezime"
                    type="text"
                    required
                    onChange={(e) => changeHandler(e)}
                    maxLength="25"
                  />
                </InputGroup>
              </Form.Group>
              <Form.Group controlId="prijava.adresa">
                <Form.Label>{`Adresa`}</Form.Label>
                <InputGroup className="mb-3">
                  <FormControl
                    name="adresa"
                    type="text"
                    required
                    onChange={(e) => changeHandler(e)}
                    maxLength="25"
                  />
                </InputGroup>
              </Form.Group>
              <Form.Group controlId="prijava.opcina">
                <Form.Label>{`Opcina`}</Form.Label>
                <InputGroup className="mb-3">
                  <FormControl
                    name="opcina"
                    type="text"
                    required
                    onChange={(e) => changeHandler(e)}
                    maxLength="25"
                  />
                </InputGroup>
              </Form.Group>
              <Form.Group controlId="prijava.postanski_broj">
                <Form.Label>{`Poštanski broj`}</Form.Label>
                <InputGroup className="mb-3">
                  <FormControl
                    name="postanski_broj"
                    type="text"
                    required
                    onChange={(e) => changeHandler(e)}
                    maxLength="25"
                  />
                </InputGroup>
              </Form.Group>
              <br />
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <a>{responseText}</a>
            <Button onClick={(e) => submitHandler(e)} variant="outline-dark">Dodaj</Button> <br />
            <Button variant="outline-danger" onClick={() => setShowDodajKorisnika(false)}>Zatvori</Button>
          </Modal.Footer>
        </Modal>
      );
  
    }
  
    if (users === null) return <a>Učitavanje...</a>
  
  
    return (
      <Container fluid>
        <h1 style={{ textAlign: 'center' }}>Admin - upravljanje sa korisnicima</h1>
        <Button onClick={() => setShowDodajKorisnika(true)} block variant="dark">Dodaj korisnika</Button>
        <Controlls />
        <Table striped bordered hover style={{ maxHeight: '100vh', overflow: 'auto' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tip</th>
              <th>Korisničko ime</th>
              <th>Lozinka</th>
              <th>Email</th>
              <th>Ime</th>
              <th>Prezime</th>
              <th>Adresa</th>
              <th>Opcina</th>
              <th>Postanski broj</th>
              <th>Odabir</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr>
                <td>{user.ID}</td>
                <td>{tipSwitch(user.tip)}</td>
                <td>{user.korisnicko_ime}</td>
                <td>{user.lozinka}</td>
                <td>{user.email}</td>
                <td>{user.ime}</td>
                <td>{user.prezime}</td>
                <td>{user.adresa}</td>
                <td>{user.opcina}</td>
                <td>{user.postanski_broj}</td>
                <td>
                  <InputGroup.Prepend>
                    <InputGroup.Checkbox onChange={(e) => { handleCheckBox(e, user) }} aria-label="Checkbox for following text input" />
                  </InputGroup.Prepend>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
  
        {/* <DodajKorisnika /> */}
        <ModalUrediTip />
        <ModalUredi />
      </Container>
  
    )
  }

  export default AdminPloca;