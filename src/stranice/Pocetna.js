import React, { useEffect } from "react";
import Cookies from 'js-cookie';
import Button from 'react-bootstrap/Button';





function Pocetna() {
    const [loggedIn, setLoggedIn] = React.useState(Cookies.get('loggedIn'))
  
  
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


  export default Pocetna;