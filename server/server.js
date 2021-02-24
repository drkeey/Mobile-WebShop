const mysql = require('mysql');
const cors = require('cors')
const bodyParser = require('body-parser')
const squel = require('squel')
const session = require('express-session');
const cookieParser = require('cookie-parser');
const sessions = require("client-sessions");
const jwt = require('jsonwebtoken');


const express = require('express')
const app = express()
const port = 4000



//Middleware
var corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions))
app.use(cookieParser());
//app.use(session({ secret: 'Emobiteli123', saveUninitialized: true, resave: true, cookie: { secure: true } }));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

//Povezivanje sa bazom podataka
let connected = false
let con
function connectToDB() {
    const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "emobiteli"
    });
    con = connection
    connection.connect(function (err) {
        if (err) {
            switch (err.code) {
                case 'ECONNREFUSED':
                    connected = false
                    return console.error('Povezivanje sa bazom podataka neuspjesno', err.code)
            }
        } else {
            console.log("Povezan sa bazom podataka!");
            connected = true
        }

    });


}
connectToDB()
let db_reconnect_interval = setInterval(function () {
    if (!connected) return connectToDB()

    clearInterval(db_reconnect_interval)
}, 2000)

function authMiddleware(req, res, next) {
    console.log('hasiram')
    if (!req.headers.authorization) return res.send('Potrebna autorizacija za pregled')
    const token = req.headers.authorization.replace('Bearer ', '')

    try {
        var decoded = jwt.verify(token, '123');
        console.log(decoded)
        let q = squel.select().from("korisnici").where(`korisnicko_ime="${decoded.username}"`).where(`lozinka="${decoded.password}"`)
        con.query(q.toString(), function (err, result, fields) {
            if (err) throw err;
            if (result.length > 0) {
                console.log('Imaga')
                req.loggedIn = true
                req.user = result[0]
                return next()
            } else {
                console.log('Nemaga')
                req.loggedIn = false
                return next()
            }

        });
    } catch (err) {
        // err
    }
}
//app.use(authMiddleware)
app.get('/pocetna', authMiddleware, (req, res) => {
    //console.log(req.headers)

})

app.get('/checkLogin', authMiddleware, (req, res) => {
    //console.log(req.headers)
    if (req.loggedIn) res.sendStatus(201)
    else res.sendStatus(202)
})


//Rute za proizvode
app.get('/uredaji', (req, res) => {
    if (!connected) return res.sendStatus(500)

    let q = squel.select().from("uredaji")

    con.query(q.toString(), function (err, result, fields) {
        if (err) { throw err };
        console.log('Slanje svih uredaja', result)
        res.send(result)
    });

})

app.post('/uredaji/filter', (req, res) => {
    if (!connected) return res.sendStatus(500)

    let q = squel.select().from("uredaji")
    if (req.body.proizvodac !== 'Svi') q.where(`proizvodac="${req.body.proizvodac}"`)
    if (req.body.godina !== 'Sve') q.where(`godina="${req.body.godina}"`)
    if (req.body.naziv !== '') q.where(`naziv LIKE '%${req.body.naziv}%'`)
    if (req.body.relevantnost !== 'Najbolje podudaranje') {
        switch (req.body.relevantnost) {
            case 'Cijena, skuplje':
                q.order('cijena', 'DESC')
                break;
            case 'Cijena, jeftinije':
                q.order('cijena', 'ASC')
                break;
            case 'Popularnost, niže':
                q.order('popularnost', 'DESC')
                break;
            case 'Popularnost, više':
                q.order('popularnost', 'ASC')
                break;
        }
    }

    con.query(q.toString(), function (err, result, fields) {
        if (err) throw err;
        console.log('Saljem filtrirane uređaje', result)
        res.send(result)
    });

})



//Rute za korisnike
app.post('/registracija', (req, res) => {
    if (!connected) return res.sendStatus(500)

    //Provjere
    async function Provjera() {
        function checkUsername() {
            return new Promise(resolve => {
                let q = squel.select().from("korisnici").where(`korisnicko_ime = "${req.body.korisnicko_ime}"`)
                con.query(q.toString(), function (err, result, fields) {
                    if (err) throw err;
                    if (result.length > 0) return resolve(false)

                    resolve(true)
                });

            })
        }
        function checkEmail() {
            return new Promise(resolve => {
                let q = squel.select().from("korisnici").where(`email = "${req.body.email}"`)
                con.query(q.toString(), function (err, result, fields) {
                    if (err) throw err;
                    if (result.length > 0) return resolve(false)
                    resolve(true)
                });
            })
        }
        const usernamePass = await checkUsername()
        const emailPass = await checkEmail()

        if (!usernamePass) return res.send('Korisničko ime već postoji u bazi podataka. Molimo da odaberete drugo.')
        if (!emailPass) return res.send('Email već postoji u bazi podataka. Molimo da odaberete drugi.')

        let q = squel.insert()
            .into("korisnici")
            .set("korisnicko_ime", req.body.korisnicko_ime)
            .set("lozinka", req.body.lozinka)
            .set("email", req.body.email)

        con.query(q.toString(), function (err, result, fields) {
            if (err) throw err;
            //console.log(result)
            console.log('Korisnik uspjesno dodan u bazu podataka')
            res.send('Registracija uspješna!')
        });
    }
    Provjera()
})

app.post('/prijava', (req, res) => {
    if (!connected) return res.sendStatus(500)

    //za svaki slucaj
    if (!req.body.korisnicko_ime || !req.body.lozinka) {
        res.status("400");
        res.send("Molimo popunite sve podatke.");
    }

    console.log('Primam prijavu', req.body)
    let q = squel.select().from("korisnici").where(`korisnicko_ime="${req.body.korisnicko_ime}"`).where(`lozinka="${req.body.lozinka}"`)
    con.query(q.toString(), function (err, result, fields) {
        if (err) throw err;
        if (result.length > 0) {
            console.log('asdasdsdasad', result)
            const token = jwt.sign({ username: req.body.korisnicko_ime, password: req.body.lozinka, tip: result[0].tip }, '123', { expiresIn: '10h' });
            console.log('asdasdsdasad', token)
            return res.json(token)
        }
        res.sendStatus(404)

    });
})

app.get('/profil', authMiddleware, (req, res) => {
    if (!connected) return res.sendStatus(500)
    if (!req.loggedIn) return res.sendStatus(403)

    res.status(200)
    res.send(req.user)

})

app.post('/updateProfile', authMiddleware, (req, res) => {
    if (!connected) return res.sendStatus(500)

    console.log(req.body)

    let q = squel.update()
        .table("korisnici")
        .set(`adresa="${req.body.adresa}"`)
        .set(`postanski_broj="${req.body.postanski_broj}"`)
        .set(`opcina="${req.body.opcina}"`)
        .where(`lozinka="${req.user.lozinka}"`)
        .toString()

    con.query(q.toString(), function (err, result, fields) {
        if (err) throw err;
        console.log(result)
        res.sendStatus(200)
    });
})


//Admin
app.get('/upravljanjeKorisnicima', authMiddleware, (req, res) => {
    const dopusteni_tipovi = [0, 1] //Tipovi koji smiju upravljati ovom rutom

    if (!connected) return res.sendStatus(500)

    let dopusten = dopusteni_tipovi.some(elem => elem === req.user.tip)
    if (!dopusten) return res.sendStatus(403)

    let q = squel.select().from("korisnici")
    con.query(q.toString(), function (err, result, fields) {
        if (err) throw err;
        if (result.length > 0) {
            //console.log('asdasdsdasad', result)
            return res.json(result)
        }
        res.sendStatus(404)

    });

})

app.post('/uredi', authMiddleware, (req, res) => {
    if (!connected) return res.sendStatus(500)
    //console.log(req.body)
    const korisnik_za_update = req.body
    const superuser = req.user
    //console.log(korisnik_za_update)
    switch (req.user.tip) { //Dopustenja i restrikcije po tipu korisnika superusera
        case 0: //Admin
            console.log('Gazimo')
            break;
        case 1: //Moderator
            //Zastita admin acca
            if (korisnik_za_update.tip === 0) return res.sendStatus(403)
            break;
    }

    let q = squel.select()
        .from("korisnici")
        .where(`ID="${korisnik_za_update.ID}"`)
        .toString()
    con.query(q.toString(), function (err, result, fields) {
        if (err) throw err;
        let q = squel.update()
            .table("korisnici")
        result.korisnicko_ime !== korisnik_za_update.korisnicko_ime ? q.set("korisnicko_ime", korisnik_za_update.korisnicko_ime) : null
        result.lozinka !== korisnik_za_update.lozinka ? q.set("lozinka", korisnik_za_update.lozinka) : null
        result.email !== korisnik_za_update.email ? q.set("email", korisnik_za_update.email) : null
        result.ime !== korisnik_za_update.ime ? q.set("ime", korisnik_za_update.ime) : null
        result.prezime !== korisnik_za_update.prezime ? q.set("prezime", korisnik_za_update.prezime) : null
        result.adresa !== korisnik_za_update.adresa ? q.set("adresa", korisnik_za_update.adresa) : null
        result.opcina !== korisnik_za_update.opcina ? q.set("opcina", korisnik_za_update.opcina) : null
        result.postanski_broj !== korisnik_za_update.postanski_broj ? q.set("postanski_broj", korisnik_za_update.postanski_broj) : null
        q.where(`ID="${korisnik_za_update.ID}"`)
        q.toString()
        con.query(q.toString(), function (err, result, fields) {
            if (err) {
                console.log('Neuspješno uredivanje korisnika')
                res.status(404)
                return res.send('Podaci nisu ažurirani')
            };
            console.log('Uspješno uredivanje korisnika')
            res.status(200)
            res.send('Podaci su ažurirani')
        });

        //res.sendStatus(200)
    });


})

app.post('/urediTip', authMiddleware, (req, res) => {
    if (!connected) return res.sendStatus(500)
    //console.log(req.body)
    const korisnik_za_update = req.body
    switch (req.user.tip) { //Dopustenja i restrikcije po tipu korisnika superusera
        case 0: //Admin
            console.log('Gazimo')
            break;
        case 1: //Moderator
            if (korisnik_za_update.tip === 0) return res.sendStatus(403)//Zastita admin acca
            break;
    }

    let q = squel.select()
        .from("korisnici")
        .where(`ID="${korisnik_za_update.korisnicko_ime}"`)
        .toString()
    con.query(q.toString(), function (err, pronadeniUser, fields) {
        if (err) throw err;
        console.log('pronadeni user', pronadeniUser)
        let q = squel.update()
            .table("korisnici")
        pronadeniUser.tip !== korisnik_za_update.tip ? q.set("tip", korisnik_za_update.tip) : null
        q.where(`ID="${korisnik_za_update.ID}"`)
        q.toString()
        con.query(q.toString(), function (err, result, fields) {
            console.log(q.toString())
            if (err) {
                console.log('Neuspješno uredivanje korisnika')
                res.status(404)
                return res.send('Podaci nisu ažurirani')
            };
            console.log('Uspješno uredivanje korisnika', result)
            res.status(200)
            res.send('Podaci su ažurirani')
        });

        //res.sendStatus(200)
    });


})

//Kosarica
app.get('/kosarica', (req, res) => {

})
app.post('/kosarica', (req, res) => {

})







app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})