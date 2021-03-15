import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";

import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import { Container } from "react-bootstrap";

import Cookies from 'js-cookie';

export default function Profil(props) {
  const [data, setData] = React.useState()
  const [editProfile, setEditProfile] = React.useState(false)
  const [fileProfilna, setFileProfilna] = React.useState();

  const history = useHistory();


  const handleChangeProfilna = (img) => {
    //Povjera formata slike
    switch (img.type) {
      case 'image/jpeg':
        break;
      case 'image/png':
        break;
      case 'image/gif':
        break;
      default:
        return alert('Nevalja format slike.')
    }
    //Velicina slike
    if (img.size >= 1000000) return alert('Slika mora biti ispod 1MB')

    let formdata = new FormData()
    formdata.append('profilna', img)
    console.log(formdata)
    let xmlhttp = new XMLHttpRequest()
    xmlhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        alert('Profilna slika uspješno postavljena')
        return handleSetProfilna()
      }
    };
    xmlhttp.onerror = function (err) {
      alert('Greška', err);
    }
    xmlhttp.open("POST", "http://localhost:4000/profil/uploadImage", true);
    xmlhttp.setRequestHeader(`Authorization`, `Bearer ${Cookies.get('token')}`)
    xmlhttp.send(
      formdata
    );
  }
  const handleSetProfilna = () => {
    let xmlhttp = new XMLHttpRequest()
    xmlhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        console.log(this.response)
        setFileProfilna(this.responseText)
      }
    };
    xmlhttp.open("GET", "http://localhost:4000/profil/profilna", true);
    xmlhttp.setRequestHeader(`Authorization`, `Bearer ${Cookies.get('token')}`)
    xmlhttp.send();
  }

  useEffect(async () => {
    //Dohvacanje podataka o profilu
    let xmlhttp = new XMLHttpRequest()
    xmlhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        //console.log(this.responseText);
        let parsed = JSON.parse(this.responseText)
        //console.log(parsed);
        setData(parsed)
        handleSetProfilna()
      }
      if (this.status === 403) { //Redirect ako je logiran vec
        return <a>Zabranjen pristp</a>
      }

    };
    xmlhttp.open("GET", "http://localhost:4000/profil", true);
    xmlhttp.setRequestHeader(`Authorization`, `Bearer ${Cookies.get('token')}`)
    //xmlhttp.responseType = 'blob'
    xmlhttp.send();

  }, []);
  //Update profila
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
    xmlhttp.open("POST", "http://localhost:4000/profil/updateProfile", true);
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
  const changeHandler = event => {
    setData(Object.assign(data, { [event.target.name]: event.target.value }));
    console.log(event.target.name, event.target.value, '     ', data)
  };

  if (!data) return <a>Loading...</a>

  return (
    <Container fluid>
      <h1 style={{ textAlign: 'center' }}>Profil</h1>
      <div style={{ margin: 'auto', width: '30%', textAlign: 'center' }}>
        <img width="200" height="200" src={fileProfilna || "https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png"} rounded />
        <br />
        <Form.File id="profil.slika" custom style={{ marginTop: '10px', marginBottom: '10px', width: '158px' }}>
          <Form.File.Input type="file" name="profilna" isValid onChange={(e) => handleChangeProfilna(e.target.files[0])} />
          <Form.File.Label data-browse="Promjeni profilnu">
          </Form.File.Label>
          {/* <Form.Control.Feedback type="valid">Uspješno promjenjena profilna slika.</Form.Control.Feedback> */}
        </Form.File>
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
