
import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import './App.css';

import Cookies from 'js-cookie';


//STRANICE
import Pocetna from "./stranice/Pocetna";
import AdminPloca from "./stranice/AdminPloca";
import NavigationBar from "./stranice/NavigationBar"
import Uredaji from "./stranice/Uredaji"
import Registracija from "./stranice/Registracija"
import Prijava from "./stranice/Prijava"
import Profil from "./stranice/Profil"
import Kosara from "./stranice/Kosara"



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
    if (Cookies.get('token') === '') return resolve(false)

    xmlhttp.open("GET", "http://localhost:4000/checkLogin", true);
    xmlhttp.setRequestHeader(`Authorization`, `Bearer ${Cookies.get('token')}`)
    xmlhttp.send();
  })

}


export default function App() {
  const [logged, isLogged] = React.useState(null)

  useEffect(async () => {
    let log = await isLoggedIn()
    isLogged(log)
    console.log('Dalisam logiran', log)
    if (logged === false) {
      Cookies.set('token', '')
      Cookies.set('loggedIn', false)
    }

  }, []);

  if (logged === null) return null

  return (
    <Router>
      <div className="App">
        <header>
          <NavigationBar isLogged={logged} />
        </header>
        <div className="body">
          <Switch>
            <Route path="/uredaji">
              <Uredaji />
            </Route>
            <Route path="/kosara">
              <Kosara />
            </Route>
            <Route path="/prijava">
              {logged ? <Redirect to="/" /> : <Prijava />}
            </Route>
            <Route path="/registracija">
              {logged ? <Redirect to="/" /> : <Registracija />}
            </Route>
            <Route path="/resetLozinke">
              {/* <ResetirajLozinku /> */}
            </Route>
            <Route path="/profil">
              {logged ? <Profil /> : <Redirect to="/" />}
            </Route>
            <Route path="/adminPloca">
              {logged ? <AdminPloca /> : <Redirect to="/" />}
              <AdminPloca />
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












// function ResetirajLozinku() {
//   return (
//     <Container fluid>
//       <h1 style={{ textAlign: 'center' }}>Resetiranje lozinke</h1>
//       <div style={{ margin: 'auto', width: '30%', textAlign: 'center' }}>
//         <InputGroup className="mb-3">
//           <InputGroup.Prepend>
//             <InputGroup.Text id="basic-addon1">Korisničko ime</InputGroup.Text>
//           </InputGroup.Prepend>
//           <FormControl
//             aria-label="Username"
//             aria-describedby="basic-addon1"
//           />
//         </InputGroup>
//         <Button style={{ marginTop: '5px' }} variant="outline-dark">Resetiraj</Button>
//       </div>

//     </Container>
//   )
// }


