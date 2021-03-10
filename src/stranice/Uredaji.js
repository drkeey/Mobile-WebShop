import React, { useEffect } from "react";

import Modal from 'react-bootstrap/Modal';
import Image from 'react-bootstrap/Image';
import Form from 'react-bootstrap/Form';
import { Container } from "react-bootstrap";
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Jumbotron from 'react-bootstrap/Jumbotron';

import { FaCartPlus } from "react-icons/fa";

import Cookies from 'js-cookie';


export default function Uredaji() {
    const [filter, setFilteri] = React.useState([])
    const [uredaji, setUredaji] = React.useState([])
    const [show, setShow] = React.useState(false)
    const [odabrani, setOdabraniUredaj] = React.useState({})
  
    
  
    //Get dostupne uredaje
    useEffect(() => {
      let xmlhttp = new XMLHttpRequest()
      xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          console.log(this.responseText);
          let parsed = JSON.parse(this.responseText)
          console.log(parsed);
          setUredaji(parsed)
          setFilteri(parsed)
        }
      };
      xmlhttp.open("GET", "http://localhost:4000/uredaji", true);
      xmlhttp.send();
    }, []);



    function dodajUKosaricu(uredaj) {
      let xmlhttp = new XMLHttpRequest()
      xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          console.log(this.responseText);
          
        }
      };
      xmlhttp.open("POkojST", "http://localhost:4000/kosara/addToKosara", true);
      //xmlhttp.setRequestHeader('Content-type', 'application/json')
      if(Cookies.get('token') !== '') xmlhttp.setRequestHeader(`Authorization`, `Bearer ${Cookies.get('token')}`)
      xmlhttp.setRequestHeader('uredajID', uredaj.id)
      console.log('saljem', uredaj.id)
      xmlhttp.send();
    }
  
    function PregledUredajaModal() {
  
      return (
        <Modal size="lg" show={show} style={{ fontFamily: `'IBM Plex Serif', serif` }}>
          
          <Modal.Body style={{ textAlign: 'center' }}>
            <Image width="100%" src={odabrani.slika_url} rounded />
            <h2>{odabrani.naziv}</h2>
            <a>{odabrani.kratki_opis}</a>
            <br />
            <b >Cijena</b>
            <h1 style={{ fontWeight: 'bold' }}>{odabrani.cijena + ',00 HRK'}</h1>
            <Button href={odabrani.link} target="_blank" variant="outline-primary" style={{ marginTop: '10px' }}>
              Otvori detaljne karakteristike
              </Button>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => setShow(false)} variant="outline-danger">
              Close
              </Button>
            <Button onClick={() => dodajUKosaricu(odabrani)} variant="outline-dark">
              Dodaj u kosaricu
              </Button>
          </Modal.Footer>
        </Modal>
      )
    }
  
    function Filter() {
      const godine = [...new Set(filter.map(mob => mob.godina))]
      const proizvodac = [...new Set(filter.map(mob => mob.proizvodac))]
  
      const [filter_proizvodac, setProizvodac] = React.useState('Svi')
      const [filter_godina_proizvodnje, setGodinaProizvodnje] = React.useState('Sve')
      const [filter_relevantnost, setRelevantnost] = React.useState('Najbolje podudaranje')
      const [filter_naziv_uredaja, setNazivUredaja] = React.useState('')
  
  
      function handleFiltriraj() {
  
        var data = new FormData();
        data.append('user', 'person');
        data.append('pwd', 'password');
        data.append('organization', 'place');
        data.append('requiredkey', 'key');
        let xmlhttp = new XMLHttpRequest()
        xmlhttp.onreadystatechange = function () {
          if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            setUredaji(JSON.parse(this.responseText))
          }
        };
        xmlhttp.open("POST", `http://localhost:4000/uredaji/filter`, true);
        xmlhttp.setRequestHeader('Content-type', 'application/json')
  
        xmlhttp.send(
          JSON.stringify(
            {
              proizvodac: filter_proizvodac,
              godina: filter_godina_proizvodnje,
              relevantnost: filter_relevantnost,
              naziv: filter_naziv_uredaja
            }
          )
  
        );
      }
  
      return (
        <Jumbotron>
          <h1>Filter</h1>
          <Form>
            <Form.Group controlId="exampleForm.SelectCustom">
              <Form.Label>Proizvođač</Form.Label>
              <Form.Control onChange={(ev) => { setProizvodac(ev.target.value) }} as="select" custom>
                <option>Svi</option>
                {proizvodac.map(g => (
                  <option key={g}>{g}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="exampleForm.SelectCustom">
              <Form.Label>Godina proizvodnje</Form.Label>
              <Form.Control onChange={(ev) => { setGodinaProizvodnje(ev.target.value) }} as="select" custom>
                <option>Sve</option>
                {godine.map(g => (
                  <option key={g}>{g}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="exampleForm.SelectCustom">
              <Form.Label>Relevantnost</Form.Label>
              <Form.Control onChange={(ev) => { setRelevantnost(ev.target.value) }} as="select" custom>
                <option>Najbolje podudaranje</option>
                <option>Cijena, skuplje</option>
                <option>Cijena, jeftinije</option>
                <option>Popularnost, niže</option>
                <option>Popularnost, više</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="exampleForm.SelectCustom">
              <Form.Label>Naziv uređaja</Form.Label>
              <InputGroup onChange={(ev) => { setNazivUredaja(ev.target.value) }} className="mb-3">
                <FormControl
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                />
              </InputGroup>
            </Form.Group>
  
          </Form>
  
          <Button onClick={() => { handleFiltriraj() }} variant="outline-dark">Filtriraj</Button>
  
  
        </Jumbotron>
      )
  
    }
  
    return (
      <Container fluid>
        <PregledUredajaModal />
        <Filter />
        <ListGroup horizontal="md" style={{ overflowY: 'auto' }}>
          {uredaji.length === 0 ? <a>Nema uređaja sa traženim filterom</a> : null}
          {uredaji.map(mob => (
            <ListGroup.Item key={mob.id}>
              <div className="flip-card">
                <div className="flip-card-inner">
                  <div className="flip-card-front">
                    <img className="card-front-image" src={mob.slika_url} alt="Avatar" />
                  </div>
                  <div className="flip-card-back">
                    <h1>{mob.naziv}</h1>
                    <p>{mob.kratki_opis}</p>
                    <br />
                    <div style={{ margin: 'auto', width: '100%', position: 'fixed', bottom: '10px' }}>
                      <b>Cijena</b>
                      <h3>{mob.cijena + ',00 HRK'}</h3> <br />
                      <Button onClick={() => {
                        setOdabraniUredaj(mob)
                        setShow(true)
                      }} 
                      variant="outline-dark">Pregled</Button>
                      <Button onClick={() => { dodajUKosaricu(mob) }} style={{ marginLeft: '5px' }} variant="outline-dark"><FaCartPlus /></Button>
                    </div>
  
                  </div>
                </div>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
  
      </Container>
    )
  }

