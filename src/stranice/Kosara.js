import React, { useEffect } from "react";

import { Container } from "react-bootstrap";
import Jumbotron from 'react-bootstrap/Jumbotron';
import ListGroup from 'react-bootstrap/ListGroup';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import Cookies from 'js-cookie';


export default function Kosara() {
    const [kosara_uredaji, setKosaraUredaji] = React.useState([])
    const [ukupnaCijena, setUkupnaCijena] = React.useState(0)
    const [dostava, setDostava] = React.useState(30)

    //Get kosara uredaji
    useEffect(() => {
        let xmlhttp = new XMLHttpRequest()
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log(this.response);
                setKosaraUredaji(JSON.parse(this.responseText))

                let cijena_ukArr = JSON.parse(this.responseText).map(el => el.cijena)
                let final = cijena_ukArr.reduce((a, b) => a + b, 0)
                console.log('final', final, cijena_ukArr)
                setUkupnaCijena(final)

                console.log(cijena_ukArr.reduce((a, b) => a + b, 0))
            }
        };
        xmlhttp.open("GET", "http://localhost:4000/kosara", true);
        if (Cookies.get('token') !== '') xmlhttp.setRequestHeader(`Authorization`, `Bearer ${Cookies.get('token')}`)
        xmlhttp.send();
    }, []);


    return (
        <Container fluid>
            <Jumbotron >
                <h1 style={{ textAlign: 'center' }}>Narudžba</h1>
                <ListGroup variant="flush">
                    {kosara_uredaji.map((uredaj, index) => (
                        <ListGroup.Item key={index}>
                            <img src={`${uredaj.slika_url}`} style={{ width: '100px', height: '100px' }} alt="Avatar" />
                            <a style={{ marginLeft: '10px' }}>{uredaj.naziv}</a>
                            <div style={{ textAlign: 'right' }}>
                                <b>Cijena</b><br />
                                <a>{`${uredaj.cijena} ,00 HRK`}</a>
                            </div>
                        </ListGroup.Item>
                    ))}

                    <ListGroup.Item>
                        <div style={{ textAlign: 'right' }}>
                            <b>Ukupno za platiti: {ukupnaCijena},00 HRK</b>
                        </div>
                    </ListGroup.Item>
                </ListGroup>
                <Button block variant="dark">Kupi kao gost</Button>
                <Button block style={{ marginTop: '2px' }} variant="dark">Nastavi kupnju kao korisnik</Button>
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
                    <b>Ukupna cijena: {ukupnaCijena + dostava},00 HRK</b>
                </div>
                <Button block variant="dark">Naruči</Button>

            </Jumbotron>






        </Container >
    )
}