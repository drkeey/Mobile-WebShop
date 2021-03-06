import React, { useEffect } from "react";

import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import { Container } from "react-bootstrap";


import Cookies from 'js-cookie';


export default function Profil() {
    const [loggedIn, setLoggedIn] = React.useState()
    const [data, setData] = React.useState()
    const [editProfile, setEditProfile] = React.useState(false)
  
    const handleUpdateProfile = () => {
      setEditProfile(false)
      let xmlhttp = new XMLHttpRequest()
      xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          alert('Podaci su uspješno ažurirani');
        }
      };
      xmlhttp.onerror = function (err) {
        alert('Greška');
      }
      xmlhttp.open("POST", "http://localhost:4000/updateProfile", true);
      xmlhttp.setRequestHeader(`Authorization`, `Bearer ${Cookies.get('token')}`)
      xmlhttp.setRequestHeader('Content-type', 'application/json')
      xmlhttp.send(
        JSON.stringify(
          {
            adresa: data.adresa,
            postanski_broj: data.postanski_broj,
            opcina: data.opcina
          }
        )
      );
  
    }
  
  
    useEffect(async () => {
      // let logged = await isLoggedIn()
      // setLoggedIn(logged)
      let xmlhttp = new XMLHttpRequest()
      xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          console.log(this.responseText);
          let parsed = JSON.parse(this.responseText)
          console.log(parsed);
          setData(parsed)
          setLoggedIn(true)
        }
        if(this.status === 401){ //Redirect ako je logiran vec
          alert('Vec si logiran')  
        }

      };
      xmlhttp.open("GET", "http://localhost:4000/profil", true);
      xmlhttp.setRequestHeader(`Authorization`, `Bearer ${Cookies.get('token')}`)
      xmlhttp.send();
  
    }, []);
  
    const changeHandler = event => {
      setData(Object.assign(data, { [event.target.name]: event.target.value }));
      console.log(event.target.name, event.target.value, '     ', data)
    };
  
    if (!loggedIn) return null
  
    return (
      <Container fluid>
        <h1 style={{ textAlign: 'center' }}>Profil</h1>
        <div style={{ margin: 'auto', width: '30%', textAlign: 'center' }}>
  
          <Form.Group controlId="profil.korisnicko_ime">
            <Form.Label>Korisničko ime</Form.Label>
            <InputGroup className="mb-3">
              <FormControl
                name="korisnicko_ime"
                type="text"
                value={data.korisnicko_ime}
                disabled
              />
            </InputGroup>
          </Form.Group>
          <Form.Group controlId="profil.lozinka">
            <Form.Label>Lozinka</Form.Label>
            <InputGroup className="mb-3">
              <FormControl
                name="lozinka"
                type="password"
                value={data.lozinka}
                disabled
              />
            </InputGroup>
          </Form.Group>
          <Form.Group controlId="profil.email">
            <Form.Label>Email</Form.Label>
            <InputGroup className="mb-3">
              <FormControl
                name="email"
                type="email"
                value={data.email}
                disabled
              />
            </InputGroup>
          </Form.Group>
          <Form.Group controlId="profil.adresa" >
            <Form.Label>Adresa</Form.Label>
            {!editProfile ?
              <InputGroup className="mb-3">
                <FormControl
                  name="adresa"
                  type="text"
                  value={data.adresa}
                  disabled
                />
              </InputGroup>
              :
              <InputGroup className="mb-3">
                <FormControl
                  name="adresa"
                  type="text"
                  onChange={(e) => changeHandler(e)}
                />
              </InputGroup>
            }
          </Form.Group>
          <Form.Group controlId="profil.postanski_broj" >
            <Form.Label>Poštanski broj</Form.Label>
            {!editProfile ?
              <InputGroup className="mb-3">
                <FormControl
                  name="postanski_broj"
                  type="text"
                  value={data.postanski_broj}
                  disabled
                />
              </InputGroup>
              :
              <InputGroup className="mb-3">
                <FormControl
                  name="postanski_broj"
                  type="text"
                  onChange={(e) => changeHandler(e)}
                />
              </InputGroup>
            }
          </Form.Group>
          <Form.Group controlId="profil.opcina" >
            <Form.Label>Opcina</Form.Label>
            {!editProfile ?
              <InputGroup className="mb-3">
                <FormControl
                  name="opcina"
                  type="text"
                  value={data.opcina}
                  disabled
                />
              </InputGroup>
              :
              <InputGroup className="mb-3">
                <FormControl
                  name="opcina"
                  type="text"
                  onChange={(e) => changeHandler(e)}
                />
              </InputGroup>
            }
          </Form.Group>
  
          {editProfile ? <Button onClick={() => handleUpdateProfile()} style={{ marginTop: '5px' }} variant="outline-dark">Spremi</Button> : <Button onClick={() => { setEditProfile(true) }} style={{ marginTop: '5px' }} variant="outline-dark">Uredi profil</Button>}
          <br />
          {data.tip === 0 ? <Button href="/adminPloca" style={{ marginTop: '5px' }} variant="outline-danger">Upravljaj korisnicima</Button> : null}
        </div>
      </Container>
  
    )
  }
  