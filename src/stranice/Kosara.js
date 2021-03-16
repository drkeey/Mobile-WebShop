import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";

import { Container } from "react-bootstrap";
import Jumbotron from 'react-bootstrap/Jumbotron';
import ListGroup from 'react-bootstrap/ListGroup';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';


import Cookies from 'js-cookie';


export default function Kosara() {
    const [kosara_uredaji, setKosaraUredaji] = React.useState([])
    const [ukupnaCijena, setUkupnaCijena] = React.useState(0)
    const [podaci, setPodaci] = React.useState({})
    const [response, setResponse] = React.useState('')

    const [brojMobitela, setBrojMobitela] = React.useState('')
    const [napomena, setNampomena] = React.useState('')
    const [dostava, setDostava] = React.useState('GLS Dostava - 30,00 HRK - 3 do 5 radnih dana')
    const [nacinPlacanja, setNacinPlacanja] = React.useState('Pouzećem')

    const history = useHistory();



    const handleSetUserPodaci = () => {
        let xmlhttp = new XMLHttpRequest()
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                setPodaci(JSON.parse(this.responseText))
                //console.log(podaci, ',,,,', JSON.parse(this.responseText))
            }
        };
        xmlhttp.open("GET", "http://localhost:4000/podaci", true);
        xmlhttp.setRequestHeader(`Authorization`, `Bearer ${Cookies.get('token')}`)
        xmlhttp.send();
    }

    const handleSetKosara = (res) => {
        let parsed = res
        //console.log('Pasiranp', parsed)
        if (parsed === 'OK') {//Ako nema proizvoda
            setUkupnaCijena('0')
            return setKosaraUredaji([])
        }
        setKosaraUredaji(JSON.parse(res))
        let cijena_ukArr = JSON.parse(res).map(el => el.cijena * el.kolicina)
        let ukupno = cijena_ukArr.reduce((a, b) => a + b, 0)
        setUkupnaCijena(ukupno)
    }

    //Get kosara uredaji
    useEffect(() => {
        handleDohvatiIzKosarice()
        handleSetUserPodaci()
    }, []);

    const handleDohvatiIzKosarice = () => {
        let xmlhttp = new XMLHttpRequest()
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                handleSetKosara(this.responseText)
            }
            if (this.readyState == 4 && this.status == 403) {
                setResponse('err')
            }
        };
        xmlhttp.open("GET", "http://localhost:4000/kosara", true);
        xmlhttp.setRequestHeader(`Authorization`, `Bearer ${Cookies.get('token')}`)
        xmlhttp.send();
    }

    const handleUkloniIzKosarice = (uredaj) => {
        let xmlhttp = new XMLHttpRequest()
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                handleDohvatiIzKosarice()
            }
        };
        xmlhttp.open("POST", "http://localhost:4000/kosara/ukloniIzKosarice", true);
        xmlhttp.setRequestHeader(`Authorization`, `Bearer ${Cookies.get('token')}`)
        xmlhttp.setRequestHeader('uredajID', uredaj.id)
        xmlhttp.send();
    }

    const handleNarucivanje = () => {
        let mob = parseInt(brojMobitela)
        //console.log(mob.toString().length)

        if(mob.toString().length < 9 || mob.toString().length > 12) return alert('Molimo upisite ispravan mobitela')


        const finalni_podaci = {
          mobitel: brojMobitela,
          napomena: napomena,
          dostava: dostava,
          nacin_placanja: nacinPlacanja
        }
        //console.log(finalni_podaci)


        let xmlhttp = new XMLHttpRequest()
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                //console.log(this.responseText);
                alert('Narudžba je uspješno zaprimljena.')
                history.push('/')
            }if(this.status === 404){
                return alert('Problem. Molimo provjerite podatke')
            }
        };
        xmlhttp.open("POST", "http://localhost:4000/kosara/narudzba", true);
        xmlhttp.setRequestHeader(`Authorization`, `Bearer ${Cookies.get('token')}`)
        xmlhttp.setRequestHeader('Content-type', 'application/json')
        xmlhttp.send(
            JSON.stringify(
                finalni_podaci
            )
        );
    }

    if (response === 'err') return <a>Nemate dozvolu za ovu stranicu.</a>
    if (kosara_uredaji.length === 0) return <h1>Košarica je prazna</h1>


    return (
        <Container fluid>
            <Jumbotron >
                <h1 style={{ textAlign: 'center' }}>Košara</h1>
                <ListGroup variant="flush">
                    {kosara_uredaji.map((uredaj, index) => (
                        <ListGroup.Item key={index}>
                            <Row>
                                <Col>
                                    <Row>
                                        <Col md="auto">
                                            <img src={`${uredaj.slika_url}`} style={{ width: '10rem', height: '10rem' }} alt="Avatar" />
                                        </Col>
                                        <Col style={{ textAlign: 'center', margin: 'auto' }}>
                                            <h3 style={{ marginLeft: '5px' }}>{uredaj.naziv}</h3>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col md="auto" style={{ textAlign: 'right' }}>
                                    <b>Količina</b><br />
                                    <a>{`${uredaj.kolicina}X`}</a><br />
                                    <b>Cijena</b><br />
                                    <a>{`${uredaj.cijena * uredaj.kolicina},00 HRK`}</a><br />
                                    <Button onClick={() => handleUkloniIzKosarice(uredaj)} variant="dark">Ukloni</Button>
                                </Col>
                            </Row>


                        </ListGroup.Item>
                    ))}

                    <ListGroup.Item>
                        <div style={{ textAlign: 'right' }}>
                            <b>Ukupna cijena: {ukupnaCijena},00 HRK</b>
                        </div>
                    </ListGroup.Item>
                    <Button onClick={() => handleSetUserPodaci()} block variant="dark">Naruči</Button>

                </ListGroup>
                {/* <Button block variant="dark">Kupi kao gost</Button>
                <Button block style={{ marginTop: '2px' }} variant="dark">Nastavi kupnju kao korisnik</Button> */}
            </Jumbotron>
            <Jumbotron>
                <h1 style={{ textAlign: 'center' }}>Podaci</h1>
                <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                        <InputGroup.Text id="basic-addon1">Ime</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                        value={podaci.ime}
                        aria-label="Ime"
                        aria-describedby="basic-addon1"
                        disabled
                    />
                </InputGroup>
                <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                        <InputGroup.Text id="basic-addon1">Prezime</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                        value={podaci.prezime}
                        aria-label="Prezime"
                        aria-describedby="basic-addon1"
                        disabled
                    />
                </InputGroup>

                <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                        <InputGroup.Text id="basic-addon1">Adresa</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                        value={podaci.adresa}
                        aria-label="Adresa"
                        aria-describedby="basic-addon1"
                        disabled
                    />
                </InputGroup>

                <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                        <InputGroup.Text id="basic-addon1">Općina</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                        value={podaci.opcina}
                        aria-label="Općina"
                        aria-describedby="basic-addon1"
                        disabled
                    />
                </InputGroup>

                <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                        <InputGroup.Text id="basic-addon1">Poštanski broj</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                        value={podaci.postanski_broj}
                        aria-label="Postanski_broj"
                        aria-describedby="basic-addon1"
                        disabled
                    />
                </InputGroup>

                <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                        <InputGroup.Text id="basic-addon1">Mobitel</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                        aria-label="Mobitel"
                        aria-describedby="basic-addon1"
                        type="number"
                        onChange={(e) => setBrojMobitela(e.target.value)}
                    />
                </InputGroup>

                <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                        <InputGroup.Text id="basic-addon1">Napomena za dostavu</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                        aria-label="Napomena_za_dostavu"
                        aria-describedby="basic-addon1"
                        onChange={(e) => setNampomena(e.target.value)}
                    />
                </InputGroup>
            </Jumbotron>
            <Jumbotron style={{ textAlign: 'center' }}>
                <h1 style={{ textAlign: 'center' }}>Dostava i plaćanje</h1>
                <Form>
                    <Form.Group controlId="exampleForm.SelectCustom">
                        <Form.Label>Način plaćanja</Form.Label>
                        <Form.Control onChange={(e) => setNacinPlacanja(e.target.value)} as="select" custom>
                            <option>Pouzećem</option>
                            <option>Kreditna kartica</option>
                            <option>Virman</option>
                            <option>Uplatnica</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="exampleForm.SelectCustom">
                        <Form.Label>Dostava</Form.Label>

                        <Form.Control onChange={(e) => setDostava(e.target.value)} as="select" custom>
                            <option>GLS Dostava - 30,00 HRK - 3 do 5 radnih dana</option>
                            <option>HP Express - 50,00 HRK - 1 do 3 radna dana</option>
                            <option>Preuzimanje u trgovini - 0 HRK</option>
                        </Form.Control>
                    </Form.Group>
                </Form>
            </Jumbotron>
            <Jumbotron style={{ textAlign: 'center' }}>
                <h1 style={{ textAlign: 'center' }}>Finalizacija</h1>
                <div style={{ textAlign: 'right' }}>
                    <b>Uređaji</b><br />
                    {kosara_uredaji.map(el => (
                        <div><a><b>{el.naziv} {`(${el.kolicina}X)`} - </b>{el.cijena * el.kolicina},00 HRK</a><br /></div>
                    ))}
                    <a>Plaćanje: <b>{`${nacinPlacanja}`}</b></a><br />
                    <a>Dostava: <b>{dostava}</b></a><br />
                    {/* <a>Ukupna cijena:</a> <b>{ukupnaCijena + dostava.cijena},00 HRK</b> */}
                </div>
                <Button onClick={() => {handleNarucivanje()}} block variant="dark">Naruči</Button>

            </Jumbotron>






        </Container >
    )
}