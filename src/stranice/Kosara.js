import React, { useEffect } from "react";

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
    const [dostava, setDostava] = React.useState(30)

    //Get kosara uredaji
    useEffect(() => {
        handleDohvatiIzKosarice()
    }, []);

    const handleDohvatiIzKosarice = () => {
        let xmlhttp = new XMLHttpRequest()
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                setKosaraUredaji(JSON.parse(this.responseText))
                console.table(JSON.parse(this.responseText))
                let cijena_ukArr = JSON.parse(this.responseText).map(el => el.cijena)
                let ukupno = cijena_ukArr.reduce((a, b) => a + b, 0)
                setUkupnaCijena(ukupno)
            }
        };
        xmlhttp.open("GET", "http://localhost:4000/kosara", true);
        if (Cookies.get('token') !== '') xmlhttp.setRequestHeader(`Authorization`, `Bearer ${Cookies.get('token')}`)
        xmlhttp.send();
    }

    const handleUkloniIzKosarice = (uredaj) => {
        let xmlhttp = new XMLHttpRequest()
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
               console.log(this.responseText)
            }
        };
        xmlhttp.open("POST", "http://localhost:4000/ukloniIzKosarice", true);
        if (Cookies.get('token') !== '') xmlhttp.setRequestHeader(`Authorization`, `Bearer ${Cookies.get('token')}`)
        xmlhttp.setRequestHeader('uredajID', uredaj.id)
        xmlhttp.send();
    }


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
            </Jumbotron>
            <Jumbotron style={{ textAlign: 'center' }}>
                <h1 style={{ textAlign: 'center' }}>Dostava i plaćanje</h1>
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
            </Jumbotron>
            <Jumbotron style={{ textAlign: 'center' }}>
                <h1 style={{ textAlign: 'center' }}>Finalizacija</h1>
                <div style={{ textAlign: 'right' }}>
                    {kosara_uredaji.map(el => (
                        <div><a><b>{el.naziv} - </b>{el.cijena},00 HRK</a><br /></div>
                    ))}

                    <a>Plaćanje: <b>Pouzećem</b></a><br />
                    <a>Dostava: <b>29,99 HRK</b></a><br />
                    <a>Ukupna cijena:</a> <b>{ukupnaCijena + dostava},00 HRK</b>
                </div>
                <Button block variant="dark">Naruči</Button>

            </Jumbotron>






        </Container >
    )
}