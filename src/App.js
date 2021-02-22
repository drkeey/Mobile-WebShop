
import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import logo from './logo.svg';
import './App.css';

import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import ListGroup from 'react-bootstrap/ListGroup';
import Jumbotron from 'react-bootstrap/Jumbotron';
import InputGroup from 'react-bootstrap/InputGroup';
import Spinner from 'react-bootstrap/Spinner';

import { Container } from "react-bootstrap";

import { FaCartPlus } from "react-icons/fa";

import Cookies from 'js-cookie'
import { resolve } from "path";

//require('dotenv').config()
const url = require('url');



//Provjera sesije
const isLoggedIn = () => {
  return new Promise(resolve => {
    let final = null
    let xmlhttp = new XMLHttpRequest()
    xmlhttp.onreadystatechange = function () {
      if (this.readyState == 4) {
        switch (this.status) {
          case 201: //Logiran
            console.log('pkl')
            final = true
            break;
          case 202: //Nije logiran
            console.log('pk22l')
            final = false
            break;
        }
      }
    };
    setInterval(() => {
      if (final !== null) return resolve(final)
    }, 100)

    xmlhttp.open("GET", "http://localhost:4000/checkLogin", true);
    xmlhttp.setRequestHeader(`Authorization`, `Bearer ${Cookies.get('token')}`)
    xmlhttp.send();
  })




}

let kosaricaArr = []
let mobiteli = [
  {
    id: 0,
    naziv: 'Xiaomi Redmi Note 9T',
    proizvodac: 'Xiaomi',
    cijena: 2100,
    kratkiOpis: 'Pogonski stroj je MediaTek Dimensity 800U (7nm) koji podržava 5G. Po pitanju memorije, predstavljene su varijante s 4GB radne memorije (LPDDR4X) te 64GB (UFS 2.1) ili 128GB (UFS 2.2) interne memorije. Baterija je kapaciteta 5000mAh uz 18W brzo žično punjenje, dok se prema službenim stranicama uz uređaj isporučuje jači 22,5W punjač. Uređaj ima NFC, a senzor otiska prsta ugrađen je na boku uređaja.',
    slikaUrl: 'https://www.centar-tehnike.hr/upload/2021/01/phone-5g_60095f8add644.png',
    godina: 2021,
    popularnost: 32
  },
  {
    id: 1,
    naziv: 'Samsung Galaxy F41',
    proizvodac: 'Samsung',
    cijena: 4200,
    kratkiOpis: 'Samsung Galaxy F41 Opremljen je 6,4-inčnim  Super AMOLED  Infinity-U zaslonom razlučivosti 1080 x 2340 piksela pri gustoći piksela od 403 piksela po kvadratnom inču (ppi) i omjeru stranica 19,5: 9.   Unutar ureza na vrhu kapljice vode nalazi se 32 MP  prednja kamera s optikom f / 2.0.',
    slikaUrl: 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-f41-sm-f415fds-1.jpg',
    godina: 2020,
    popularnost: 57
  },
  {
    id: 2,
    naziv: 'Xiaomi Redmi Note 8',
    proizvodac: 'Xiaomi',
    cijena: 1800,
    kratkiOpis: 'Redmi Note 7 je postao prvi Redmi smartfon sa staklenim stražnjim panelom, gradacijskom bojom i kapljičastim izrezom na ekranu, a taj dizajnerski potpis nosi i njegov Redmi Note 8 nasljednik uz neke sitne promjene. Prednja i stražnja strana ovog uređaja prekrivena je 2.5D zakrivljenim Corning Gorilla Glass 5 zaštitnim staklom, a boje kućišta su veoma privlačne, pogotovo ljubiteljima plave boje.',
    slikaUrl: 'https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-redmi-note-8-1.jpg',
    godina: 2019,
    popularnost: 42
  },
  {
    id: 3,
    naziv: 'Apple iPhone XR',
    proizvodac: 'Apple',
    cijena: 5500,
    kratkiOpis: 'Appleov A12 procesor najmoćniji je danas mobilni čip, a jedna od glavnih prednosti XR-a je što vam omogućava pristup svim tim sokovima A12. Na Geekbenchu, on je od 10 do 15 posto veći od iPhone 8 i iPhone X u smislu čistih performansi CPU-a i 40 posto više u odnosu na performanse računalnih GPU-a. Na GFXBenchu, grafičkom mjerilu, slično je 40 do 45 posto bolje nego na iPhoneu 8 na terenskim ekranima, koji ne uzimaju u obzir razlučivost zaslona.',
    slikaUrl: 'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-xr-3.jpg',
    godina: 2019,
    popularnost: 42
  },
  {
    id: 4,
    naziv: 'Sony Xperia XZ1',
    proizvodac: 'Sony',
    cijena: 1800,
    kratkiOpis: 'Xperiju XZ1 pokreće Snapdragon 835, trenutno najjači Qualcommov SoC. Četiri brze Kryo jezgre rade na taktu od 2,35 GHz, četiri štedljive na 1,9 GHz, a Adreno 540 GPU na 710 MHz. Uz 4 GB RAM-a, ne treba očekivati ništa manje od odličnih performansi koje su nam potvrdili AnTuTu i Geekbench testovi. ',
    slikaUrl: 'https://fdn2.gsmarena.com/vv/pics/sony/sony-xperia-xz1-1.jpg',
    godina: 2019,
    popularnost: 42
  },
  {
    id: 5,
    naziv: 'Huawei P9 lite',
    proizvodac: 'Huawei',
    cijena: 1800,
    kratkiOpis: '',
    slikaUrl: 'https://fdn2.gsmarena.com/vv/pics/huawei/huawei-p9-lite-01.jpg',
    godina: 2019,
    popularnost: 42
  },
  {
    id: 6,
    naziv: 'Xiaomi Redmi Note 8',
    proizvodac: 'Xiaomi',
    cijena: 1800,
    kratkiOpis: '',
    slikaUrl: 'https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-redmi-note-8-1.jpg',
    godina: 2019,
    popularnost: 42
  },
  {
    id: 7,
    naziv: 'Xiaomi Redmi Note 8',
    proizvodac: 'Xiaomi',
    cijena: 1800,
    kratkiOpis: '',
    slikaUrl: 'https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-redmi-note-8-1.jpg',
    godina: 2019,
    popularnost: 42
  },
  {
    id: 8,
    naziv: 'Xiaomi Redmi Note 8',
    proizvodac: 'Xiaomi',
    cijena: 1800,
    kratkiOpis: '',
    slikaUrl: 'https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-redmi-note-8-1.jpg',
    godina: 2019,
    popularnost: 42
  },
]


function Navigation() {

  const [loggedIn, setLoggedIn] = React.useState(Cookies.get('loggedIn'))


  useEffect(async () => {
    let logged = await isLoggedIn()
    setLoggedIn(logged)
  }, []);

  function handleLogOut() {
    Cookies.set('token', '')
    Cookies.set('loggedIn', false)
    setLoggedIn(false)
    console.log()
  }

  function Kosarica() {
    const [korpa, setKorpa] = React.useState([])
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
        {korpa.forEach(mobitel => {
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
        })}
        <div style={{ textAlign: 'right' }}>
          <br /><b style={{ marginRight: '10px' }}>Ukupno: 2.100,00 HRK</b>
        </div>
        <NavDropdown.Divider />
        <NavDropdown.Item href="#action/3.4" href="/narudzba">Završi kupnju</NavDropdown.Item>
      </NavDropdown>
    )
  }

  return (
    <Navbar className="navbar" bg="light" expand="lg">
      <Navbar.Brand href="/">E-Mobiteli</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="/uredaji">Uređaji</Nav.Link>
          <NavDropdown title="Profil" id="basic-nav-dropdown">
            {loggedIn === true ?
              <div>
                <NavDropdown.Item href="/profil">Pregled profila</NavDropdown.Item>
                <NavDropdown.Item onClick={() => { handleLogOut() }} href="/">Odjava</NavDropdown.Item>
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

export default function App() {
  return (
    <Router>
      <div className="App">
        <header>
          <Navigation />
        </header>
        <div className="body">

          <Switch>
            <Route path="/uredaji">
              <Uredaji />
            </Route>
            <Route path="/narudzba">
              <Narudzba />
            </Route>
            <Route path="/prijava">
              <Prijava />
            </Route>
            <Route path="/registracija">
              <Registracija />
            </Route>
            <Route path="/resetLozinke">
              <ResetirajLozinku />
            </Route>
            <Route path="/">
              <Pocetna />
            </Route>

          </Switch>
        </div>
      </div>
    </Router >
  );
}


// let timer = setTimeout(() => {
//   setKorpa(kosaricaArr)
//   console.log('a')
// }, 1000)





function Uredaji() {
  const [filter, setFilteri] = React.useState([])
  const [uredaji, setUredaji] = React.useState([])

  function addToCart(item) {
       
  }

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
      //let url = new URL(`http://localhost:4000/uredaji/filter?=${q_proizvod() + q_godina_proizvodnje() + q_relevantnost() + q_naziv_uredaja()}`)
      console.log(url.search)
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
      <Filter />
      <ListGroup horizontal="md">
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
                    <h3>{mob.cijena + ',00 HRK'}</h3> <br />
                    <Button variant="outline-dark">Pregled</Button>
                    <Button onClick={() => { addToCart(mob) }} style={{ marginLeft: '5px' }} variant="outline-dark"><FaCartPlus /></Button>
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

function Narudzba() {
  return (
    <Container fluid>
      <h1 style={{ textAlign: 'center' }}>Narudžba</h1>
      <Jumbotron style={{ width: '50vw', margin: 'auto' }}>
        <ListGroup variant="flush">
          <ListGroup.Item>
            <img src="https://www.centar-tehnike.hr/upload/2021/01/phone-5g_60095f8add644.png" style={{ width: '100px', height: '100px' }} alt="Avatar" />
            <a>Samsung Galaxy F41</a>
            <b> (1 komad)</b>
            <br /><b>Cijena: 2.100,00 HRK</b>
          </ListGroup.Item>
          <ListGroup.Item>
            <img src="https://www.centar-tehnike.hr/upload/2021/01/phone-5g_60095f8add644.png" style={{ width: '100px', height: '100px' }} alt="Avatar" />
            <a>Samsung Galaxy F41</a>
            <b> (1 komad)</b>
            <br /><b>Cijena: 2.100,00 HRK</b>
          </ListGroup.Item>
          <ListGroup.Item>
            <div style={{ textAlign: 'right' }}>
              <b>Ukupna cijena: 2.100,00 HRK</b>
            </div>
          </ListGroup.Item>
        </ListGroup>
        <Button block variant="dark">Kupi kao gost</Button>
        <Button block style={{ marginTop: '2px' }} variant="dark">Nastavi kupnju kao korisnik</Button>

        <div>
          <h1 style={{ textAlign: 'center' }}>Podaci</h1>
          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text id="basic-addon1">Ime</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text id="basic-addon1">Prezime</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
          </InputGroup>

          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text id="basic-addon1">Adresa</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
          </InputGroup>

          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text id="basic-addon1">Općina</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
          </InputGroup>

          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text id="basic-addon1">Poštanski broj</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
          </InputGroup>

          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text id="basic-addon1">Mobitel</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
          </InputGroup>

          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text id="basic-addon1">Napomena za dostavu</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
          </InputGroup>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Form>
            <Form.Group controlId="exampleForm.SelectCustom">
              <Form.Label>Način plaćanja</Form.Label>
              <Form.Control as="select" custom>
                <option>Pouzećem</option>
                <option>Kreditna kartica</option>
                <option>Virman</option>
                <option>Uplatnica</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="exampleForm.SelectCustom">
              <Form.Label>Dostava</Form.Label>
              <Form.Control as="select" custom>
                <option>GLS Dostava - 29,99 HRK - 3 do 5 radnih dana</option>
                <option>HP Express - 49,99 HRK - 1 do 3 radna dana</option>
                <option>Preuzimanje u trgovini - 0 HRK</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </div>

        <div style={{ textAlign: 'center' }}>
          <h1 style={{ textAlign: 'center' }}>Finalizacija</h1>
          <div style={{ textAlign: 'right' }}>
            <a><b>Samsung Galaxy F41 (1x)</b> 2,100,00 HRK</a><br />
            <a>Poštarina: 29,99 HRK</a><br />
            <b>Ukupna cijena: 2.100,00 HRK</b>
          </div>
          <Button variant="dark">Naruči</Button>

        </div>



      </Jumbotron>

    </Container>
  )
}

function Pocetna() {
  const [loggedIn, setLoggedIn] = React.useState()

  useEffect(async () => {
    let logged = await isLoggedIn()
    setLoggedIn(logged)
  }, []);

  return (
    <div className="pocetna-stranica">
      <div className="hero-image">
        <div className="pocetna-tekst">
          <h1>E-Mobiteli</h1>
          <h2>Web Shop sa modernim mobilnim telefonima</h2>
          <Button href="uredaji" variant="dark">Pregled mobilnih telefona</Button>
          <iframe src="http://free.timeanddate.com/clock/i7or6fjt/szw110/szh110/hoc09f/hbw0/hfc09f/cf100/hnce1ead6/fas30/fdi66/mqc000/mql15/mqw4/mqd98/mhc000/mhl15/mhw4/mhd98/mmc000/mml10/mmw1/mmd98/hhs2/hms2/hsv0" frameborder="0" style={{ position: 'absolute', left: '0px', bottom: '0px' }}></iframe>
        </div>
      </div>
      <div>
        <a class="weatherwidget-io" href="https://forecast7.com/en/45d0718d69/zupanja/" data-label_1="ŽUPANJA" data-label_2="WEATHER" data-theme="original" >ŽUPANJA WEATHER</a>
        {!function (d, s, id) { var js, fjs = d.getElementsByTagName(s)[0]; if (!d.getElementById(id)) { js = d.createElement(s); js.id = id; js.src = 'https://weatherwidget.io/js/widget.min.js'; fjs.parentNode.insertBefore(js, fjs); } }(document, 'script', 'weatherwidget-io-js')}
      </div>
    </div>
  )
}

function Prijava() {
  const [loading, setLoading] = React.useState(false)
  const [loginResponse, setLoginResponse] = React.useState()

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
        podaci
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

function Registracija() {
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
    console.log(podaci, event.target)
    //Registracija
    let xmlhttp = new XMLHttpRequest()
    xmlhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        console.log(this.responseText);
        setLoading(false)
        return setRegisterResponse(this.responseText)
      }
      setRegisterResponse(this.responseText)
      setLoading(false)
    };
    xmlhttp.open("POST", "http://localhost:4000/registracija", true);
    xmlhttp.setRequestHeader('Content-type', 'application/json')
    console.log(podaci)
    xmlhttp.send(
      JSON.stringify(
        podaci
      )
    );
  };

  const changeHandler = event => {
    setPodaci(Object.assign(podaci, { [event.target.name]: event.target.value }));
    console.log(event.target.name, event.target.value, '     ', podaci)
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

function ResetirajLozinku() {
  return (
    <Container fluid>
      <h1 style={{ textAlign: 'center' }}>Resetiranje lozinke</h1>
      <div style={{ margin: 'auto', width: '30%', textAlign: 'center' }}>
        <InputGroup className="mb-3">
          <InputGroup.Prepend>
            <InputGroup.Text id="basic-addon1">Korisničko ime</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            aria-label="Username"
            aria-describedby="basic-addon1"
          />
        </InputGroup>
        <Button style={{ marginTop: '5px' }} variant="outline-dark">Resetiraj</Button>
      </div>

    </Container>
  )
}


