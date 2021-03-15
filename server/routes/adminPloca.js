const express = require('express');
const router = express.Router();
const db = require('../db')
const squel = require('squel')
const middlewares = require('../middleware')


router.use(middlewares.authMiddleware)


//Admin i moderator stvari
router.get('/', (req, res) => {
    if (req.loggedIn === false) return res.status(403).send('Zabranjen pristup.')

    const dopusteni_tipovi = [0, 1] //Tipovi koji smiju upravljati ovom rutom - admin i moderator
    const dopusten = dopusteni_tipovi.some(elem => elem === req.user.tip)
    if (!dopusten) return res.sendStatus(403)

    //Slanje svih korisnika superuseru
    let q = squel.select().from("korisnici")
    db.connection().query(q.toString(), function (err, result, fields) {
        if (err) throw err;
        if (result.length > 0) {
            return res.json(result)
        }
        res.sendStatus(404)
    });
})

router.post('/uredi', (req, res) => {
    if (req.loggedIn === false) return res.status(403).send('Zabranjen pristup.')

    const korisnik_za_update = req.body
    //console.log(korisnik_za_update)
    switch (req.user.tip) { //Dopustenja i restrikcije po tipu korisnika superusera
        case 0: //Admin
            console.log('Sve')
            break;
        case 1: //Moderator
            //Zastita admin acca
            if (korisnik_za_update.tip === 0) return res.status(403).send('Nije moguće urediti admin korisnika')
            break;
        default: //Ostalo
            return res.status(403).send('Nemate dozvolu za uredivanje.')
    }

    let q = squel.select()
        .from("korisnici")
        .where(`ID="${korisnik_za_update.ID}"`)
        .toString()
    db.connection().query(q.toString(), function (err, result, fields) {
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
        db.connection.query(q.toString(), function (err, result, fields) {
            if (err) {
                console.log('Neuspješno uredivanje korisnika')
                res.status(404)
                return res.send('Podaci nisu ažurirani')
            };
            console.log('Uspješno uredivanje korisnika')
            res.status(200)
            res.send('Podaci su ažurirani')
        });
    });


})

router.post('/urediTip', (req, res) => {
    if (req.loggedIn === false) return res.status(403).send('Zabranjen pristup.')

    //console.log(req.body)
    const korisnik_za_update = req.body
    switch (req.user.tip) { //Dopustenja i restrikcije po tipu korisnika superusera
        case 0: //Admin
            console.log('Gazimo')
            break;
        case 1: //Moderator
            if (korisnik_za_update.tip === 0) return res.status(403).send('Nije moguće urediti admin korisnika')
            break;
        default: //Ostalo
            return res.status(403).send('Nemate dozvolu za uredivanje.')
    }

    let q = squel.select()
        .from("korisnici")
        .where(`ID="${korisnik_za_update.korisnicko_ime}"`)
        .toString()
    db.connection().query(q.toString(), function (err, pronadeniUser, fields) {
        if (err) throw err;
        console.log('pronadeni user', pronadeniUser)
        let q = squel.update()
            .table("korisnici")
        pronadeniUser.tip !== korisnik_za_update.tip ? q.set("tip", korisnik_za_update.tip) : null
        q.where(`ID="${korisnik_za_update.ID}"`)
        q.toString()
        db.connection.query(q.toString(), function (err, result, fields) {
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

router.post('/obrisi', (req, res) => {
    if (req.loggedIn === false) return res.status(403).send('Zabranjen pristup.')

    //console.log(req.body)
    const korisnici_za_obrisatID = req.body
    switch (req.user.tip) { //Dopustenja i restrikcije po tipu request korisnika
        case 0: //Admin
            console.log('Gazimo')
            break;
        case 1: //Moderator
            if (korisnici_za_obrisatID.some(el => el === 0)) {
                return res.status(404).send('Nije moguće obrisati administratora.')
            }
            //if (korisnik_za_obrisat.tip === 0) return res.sendStatus(403)//Zastita admin acca
            break;
        default: //Ostalo
            return res.status(403).send('Nemate dozvolu za brisanje.')
    }


    let str = korisnici_za_obrisatID.join(' OR ID = ')
    console.log(str)
    let q = squel.delete('*')
    q.from("korisnici")
    q.where(
        `ID = ${str}`
    )
    q.toString()

    db.connection().query(q.toString(), function (err, result, fields) {
        console.log(q.toString())
        if (err) {
            console.log(err)
            console.log('Neuspješno brisanje korisnika')
            res.status(404)
            return res.send('Podaci nisu obrisani. Greška')
        };
        console.log('Uspješno brisanje korisnika', result)
        res.status(200)
        res.send('Podaci su ažurirani')
    });



})

router.post('/dodajKorisnika', (req, res) => {
    if (req.loggedIn === false) return res.status(403).send('Zabranjen pristup.')

    switch (req.user.tip) { //Dopustenja i restrikcije po tipu korisnika superusera
        case 0: //Admin
            console.log('Sve')
            break;
        case 1: //Moderator
            //Zastita admin acca
            if(req.body.tip === 0) return res.status(403).send('Nemoguce dodati admin racun')
            break;
        default: //Ostalo
            return res.status(403).send('Nemate dozvolu za uredivanje.')
    }

    const novi_korisnik = req.body
    console.log(novi_korisnik)
    //Provjera dali je sve popunjeno
    for (const [key, value] of Object.entries(novi_korisnik)) {
        if (value === '') return res.send('Molimo popunite sve podatke')
    }

    //Provjeravamo dali postoje konflikti, ako ih nema ubacujemo novog korisnika
    async function provjera(next) {
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
        if (req.body.tip === 0) return res.send('Nije moguće postaviti tip 0')
        next()
    }
    provjera(function () {
        let q = squel.insert()
            .into("korisnici")
            .set("tip", parseInt(req.body.tip))
            .set("korisnicko_ime", req.body.korisnicko_ime)
            .set("lozinka", req.body.lozinka)
            .set("email", req.body.email)
            .set("ime", req.body.ime)
            .set("prezime", req.body.prezime)
            .set("adresa", req.body.adresa)
            .set("opcina", req.body.opcina)
            .set("postanski_broj", req.body.postanski_broj)


        db.connection().query(q.toString(), function (err, result, fields) {
            if (err) res.send('Problem prilikom dodavanja korisnika.');
            //console.log(result)
            console.log('Korisnik uspjesno dodan u bazu podataka')
            res.send('Korisnik uspjesno dodan u bazu podataka')
        });
    })




})

module.exports = router;
