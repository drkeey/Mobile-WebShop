
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

export default function App() {
  const [logged, setLogged] = React.useState(async () => {
    let xmlhttp = new XMLHttpRequest()
    xmlhttp.onreadystatechange = function () {
      if (this.readyState == 4) {
        //console.log(this.responseText, this.status)
        switch (this.status) {
          case 200: //Logiran
            console.log(`%c LOGIRAN `, 'color: white; background-color: #2274A5', true)
            return setLogged(true)

          case 204: //Nije logiran
          console.log(`%c LOGIRAN `, 'color: white; background-color: #2274A5', false)
          return setLogged(false)

          //Errori
          case 500: //Problem sa bazom
            return setLogged(this.responseText)

        }
      }
    };
    xmlhttp.open("GET", "http://localhost:4000/checkLogin", true);
    xmlhttp.setRequestHeader(`Authorization`, `Bearer ${Cookies.get('token')}`)
    xmlhttp.send();
  })

  if (typeof logged === 'string') return <a>Problem s bazom podataka</a>
  if (typeof logged !== 'boolean') return <a>Učitavanje...</a>


  return (
    <Router>
      <div className="App">
        <header>
          <NavigationBar isLogged={Boolean(logged)} />
        </header>
        <div className="body">
          <Switch>
            <Route path="/uredaji">
              <Uredaji />
            </Route>
            <Route path="/kosara">
              {Boolean(logged) !== true ? <Redirect to="/" /> : <Kosara />}
            </Route>
            <Route path="/prijava">
              {Boolean(logged) === true ? <Redirect to="/" /> : <Prijava />}
            </Route>
            <Route path="/registracija">
              {Boolean(logged) === true ? <Redirect to="/" /> : <Registracija />}
            </Route>
            <Route path="/resetLozinke">
              {/* <ResetirajLozinku /> */}
            </Route>
            <Route path="/profil">
              {Boolean(logged) === true ? <Profil /> : <Redirect to="/" />}
            </Route>
            <Route path="/adminPloca">
              {Boolean(logged) === true ? <AdminPloca /> : <Redirect to="/" />}
            </Route>
            <Route path="/">
              <Pocetna isLogged={Boolean(logged)} />
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


