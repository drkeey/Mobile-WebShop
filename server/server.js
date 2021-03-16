
const mysql = require('mysql');
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const squel = require('squel')
const jwt = require('jsonwebtoken');
const db = require('./db');
const express = require('express');
const app = express()
const port = 4000

const profil = require('./routes/profil');
const uredaji = require('./routes/uredaji');
const adminPloca = require('./routes/adminPloca');
const kosara = require('./routes/kosara');

const middlewares = require('./middleware')

const CryptoJS = require("crypto-js");



//Middleware
var corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions))
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(express.static('./public'))
//Rute
app.use('/profil', profil)
app.use('/uredaji', uredaji)
app.use('/adminPloca', adminPloca)
app.use('/kosara', kosara)


app.get('/checkLogin', middlewares.authMiddleware, (req, res) => {
    if (req.loggedIn) {
        return res.status(200).send('RESPONSE: LOGIRAN')
    }
    res.status(204).send('RESPONSE: NIJE LOGIRAN')
})



app.get('/podaci', middlewares.authMiddleware, (req, res) => {
    if (!req.loggedIn) return res.send({})
    let final = {
        ime: req.user.ime,
        prezime: req.user.prezime,
        adresa: req.user.adresa,
        opcina: req.user.opcina,
        postanski_broj: req.user.postanski_broj,
    }
    res.send(final)
})
//Rute za korisnike
app.get('/pocetna', middlewares.authMiddleware, (req, res) => {
    if (req.loggedIn) res.send(`Dobrodošao/la ${req.user.korisnicko_ime} nazad!`)
})

app.get('/logout', (req, res) => {
    if (!db.connected()) return res.status(500).send('Problem sa bazom podataka.')
    if (!req.loggedIn) return res.sendStatus(403)

    req.user = null
    req.loggedIn = false
})

app.post('/registracija', (req, res) => {
    if (!db.connected) return res.sendStatus(500)

    //Provjere
    async function Provjera() {
        function checkUsername() {
            return new Promise(resolve => {
                let q = squel.select().from("korisnici").where(`korisnicko_ime = "${req.body.korisnicko_ime}"`)
                db.connection().query(q.toString(), function (err, result, fields) {
                    if (err) throw err;
                    if (result.length > 0) return resolve(false)

                    resolve(true)
                });

            })
        }
        function checkEmail() {
            return new Promise(resolve => {
                let q = squel.select().from("korisnici").where(`email = "${req.body.email}"`)
                db.connection().query(q.toString(), function (err, result, fields) {
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
            .set("lozinka", CryptoJS.AES.encrypt(req.body.lozinka, '123').toString())
            .set("email", req.body.email)

        db.connection().query(q.toString(), function (err, result, fields) {
            if (err) throw err;
            //console.log(result)
            console.log('Korisnik uspjesno dodan u bazu podataka')
            res.send('Registracija uspješna!')
        });
    }
    Provjera()
})

app.post('/prijava', (req, res) => {
    if (!db.connected) return res.sendStatus(500)

    //za svaki slucaj
    if (!req.body.korisnicko_ime || !req.body.lozinka) {
        res.status("400");
        res.send("Molimo popunite sve podatke.");
    }

    console.log('Primam prijavu', req.body)
    //console.log('Primam prijasdasdavu',db_connection)

    let q = squel.select().from("korisnici").where(`korisnicko_ime="${req.body.korisnicko_ime}"`)
    db.connection().query(q.toString(), function (err, result, fields) {
        if (err) return console.error(err);
        if (result.length > 0) {
            //REQ
            let decrypted = CryptoJS.AES.decrypt(req.body.lozinka, '123')
            let str = decrypted.toString(CryptoJS.enc.Utf8);
            //DB
            let decryptedDB = CryptoJS.AES.decrypt(result[0].lozinka, '123')
            let strDB = decryptedDB.toString(CryptoJS.enc.Utf8);

            if (str !== strDB) return res.sendStatus(404)

            const token = jwt.sign({ username: req.body.korisnicko_ime, password: req.body.lozinka, tip: result[0].tip }, '123', { expiresIn: '10h' });
            console.log('asdasdsdasad', token)
            return res.json(token)
        }
        res.sendStatus(404)

    });
})



app.listen(port, () => {
    console.log(`Express server na http://localhost:${port}`)
})