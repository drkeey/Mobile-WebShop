const express = require('express');
const router = express.Router();
const db = require('../db')
const squel = require('squel')
const middlewares = require('../middleware')


router.use(middlewares.authMiddleware)
//Kosarica
router.get('/', (req, res) => {
    //uzimanje kosarice od usera i pretvaranje u array
    if (!req.loggedIn) return res.sendStatus(403)
    let user_uredajiArr = req.user.kosara.split(' ').map(Number).filter(el => el !== 0)
    if (user_uredajiArr.length === 0) return res.sendStatus(200)
    user_uredajiArr = user_uredajiArr.map(el => parseInt(el))

    //dohvacanje mobitela za display
    let count = {};
    user_uredajiArr.forEach(function (i) { count[i] = (count[i] || 0) + 1; });
    const mobiteliUnique = Object.keys(count)
    let q_string = 'ID=' + mobiteliUnique.join(' OR ID=')
    let q = squel.select().from('uredaji')
    q.where(q_string)
    db.connection().query(q.toString(), function (err, result, fields) {
        if (err) throw err;
        let final = result.map(el => {
            let copy = Object.assign({}, el)
            copy.kolicina = count[el.id]
            return copy
        })
        res.send(JSON.stringify(final))
    });
})

router.post('/addToKosara', (req, res) => {
    if (!req.loggedIn) return res.sendStatus(403)

    let uredaj_id = req.header('uredajid')
    let kosarica = []

    if (req.user.kosara === '') {//Ako je prazna kosarica
        kosarica = [uredaj_id + ' ']
    } else {
        kosarica = req.user.kosara.split(' ').map(Number)
        let upp = kosarica.filter(el => el !== 0)
        kosarica = upp
        kosarica.push(uredaj_id)
        let filtered = kosarica.map(el => parseInt(el))
        kosarica = filtered
    }

    let q = squel.update().table("korisnici").set("kosara", kosarica.join(' ')).where(`ID="${req.user.ID}"`)
    db.connection().query(q.toString(), function (err, result, fields) {
        if (err) throw err;
        console.log('Uspjesno', result, fields, q.toString())
        res.send(kosarica)
    });
})

router.post('/ukloniIzKosarice', (req, res) => {
    if (!req.loggedIn) return res.sendStatus(403)

    let uredaj_id = req.header('uredajid')
    if (uredaj_id === '') return res.sendStatus(404)

    let kosarica = req.user.kosara.split(' ').map(Number)
    //console.log(kosarica)
    if (req.user.kosara.length === 0) {//Ako je prazna kosarica
        return res.sendStatus('404')
    }

    let upp = kosarica.map(el => el)
    const index = upp.indexOf(parseInt(uredaj_id))
    if (index > -1) {
        upp.splice(index, 1)
    }
    //console.log(kosarica, 'Za maknit ', uredaj_id,'index ', index, 'nakon ', upp)

    let q = squel.update().table("korisnici").set("kosara", upp.join(' ')).where(`ID="${req.user.ID}"`)
    db.connection().query(q.toString(), function (err, result, fields) {
        if (err) throw err;
        console.log('Uspjesno', result, fields, q.toString())
        res.send(upp)
    });




})


router.post('/narudzba', async (req, res) => {
    if (!req.loggedIn) return res.sendStatus(403)

    if(req.body.mobitel === '') return res.status(404).send('Molimo upisite broj mobitela')

    let podaci = req.body
    console.log(podaci)
    let dostava = undefined
    let placanje = undefined

    let dodaci = 0
    //Provjera
    switch (podaci.dostava) {
        case 'GLS Dostava - 30,00 HRK - 3 do 5 radnih dana':
            dostava = 0
            dodaci += 30
            break;
        case 'HP Express - 50,00 HRK - 1 do 3 radna dana':
            dostava = 1
            dodaci += 50
            break;
        case 'Preuzimanje u trgovini - 0 HRK':
            dostava = 2
            break;
        default:
            return res.status(404).send('Nepostojeci izbor dostave')
    }

    switch (podaci.nacin_placanja) {
        case 'Pouzećem':
            placanje = 0
            break;
        case 'Kreditna kartica':
            placanje = 1
            break;
        case 'Virman':
            placanje = 2
            break;
        case 'Uplatnica':
            placanje = 3
            break;
        default:
            return res.status(404).send('Nepostojeci izbor placanja')
    }

    if (dostava === undefined || placanje === undefined) return res.status(404).send('Provjerite dostavu i nacin placanja')


    function getMobiteliCijena() {
        return new Promise(resolve => {
            let user_kosara = req.user.kosara.split(' ').map(Number).filter(el => el !== 0)
            if (user_kosara.length === 0) return res.sendStatus(200)
            user_kosara = user_kosara.map(el => parseInt(el))

            //dohvacanje mobitela za display
            let count = {};
            user_kosara.forEach(function (i) { count[i] = (count[i] || 0) + 1; });
            const mobiteliUnique = Object.keys(count)
            let q_string = 'ID=' + mobiteliUnique.join(' OR ID=')
            let q = squel.select().from('uredaji')
            q.where(q_string)
            db.connection().query(q.toString(), function (err, result, fields) {
                if (err) throw err;
                let cijena = result.map(el => {
                    return el.cijena * count[el.id]
                })
                //console.log(cijena)
                resolve(cijena)
                //res.send(JSON.stringify(final))
            });
        })
    }

    const cijenaArr = await getMobiteliCijena()
    console.log(cijenaArr, cijenaArr.length)

    const cijena = cijenaArr.reduce((acc,current) => acc + current)

    let q = squel.insert()
        .into("narudzba")
        .set("ime", req.user.ime)
        .set("prezime", req.user.prezime)
        .set("email", req.user.email)
        .set("adresa", req.user.adresa)
        .set("opcina", req.user.opcina)
        .set("postanski_broj", req.user.postanski_broj)
        .set("mobitel", req.body.mobitel)
        .set("napomena", req.body.napomena)
        .set("uredaji", req.user.kosara)
        .set("nacin_placanja", req.body.nacin_placanja)
        .set("dostava", req.body.dostava)
        .set("cijena", cijena)

    db.connection().query(q.toString(), function (err, result, fields) {
        if (err) throw err;
        res.status(200).send('Narudzba zaprimljena.!')

        //Ciscenje kosare od korisnika nakon uspjesne kupnje
        let q = squel.update()
        .table('korisnici')
        .set('kosara', '')
        .where('ID', req.user.ID)

        db.connection().query(q.toString(), function (err, result, fields) {
            if (err) throw err;
            console.log('Kosara ociscena')
            
        });

    });


})

module.exports = router;
