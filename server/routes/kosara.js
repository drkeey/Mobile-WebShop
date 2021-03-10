const express = require('express');
const router = express.Router();
const db = require('../db')
const squel = require('squel')
const middlewares = require('../middleware')


router.use(middlewares.authMiddleware)
//Kosarica
router.get('/', (req, res) => {
    //uzimanje kosarice od usera i pretvaranje u array
    //console.log('gledaj',req.user.loggedIn)
    if(!req.loggedIn) return res.sendStatus(403)
    let user_uredajiArr = req.user.kosara.split(' ').map(Number).filter(el => el !== 0)
    console.log('Duzina', user_uredajiArr, user_uredajiArr.length)
    if(user_uredajiArr.length === 0) return res.sendStatus(200)

    user_uredajiArr = user_uredajiArr.map(el => parseInt(el))
    console.log('a', user_uredajiArr)

    //dohvacanje mobitela za display
    let count = {};
    user_uredajiArr.forEach(function (i) { count[i] = (count[i] || 0) + 1; });
    const mobiteliUnique = Object.keys(count)
    let q_string = 'ID=' + mobiteliUnique.join(' OR ID=')

    let q = squel.select().from('uredaji')
    q.where(q_string)
    console.log(q.toString())
    db.connection.query(q.toString(), function (err, result, fields) {
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
    db.connection.query(q.toString(), function (err, result, fields) {
        if (err) throw err;
        console.log('uspjeh', result, fields, q.toString())
        res.send(kosarica)
    });
})

router.post('/ukloniIzKosarice', (req, res) => {
    let uredaj_id = req.header('uredajid')
    if (uredaj_id === '') return res.sendStatus(404)

    let kosarica = req.user.kosara.split(' ').map(Number)
    console.log(kosarica)
    if (req.user.kosara.length === 0) {//Ako je prazna kosarica
        return res.sendStatus('404')
    }
    
    let upp = kosarica.map(el => el)
    const index = upp.indexOf(parseInt(uredaj_id))
    if (index > -1) {
        upp.splice(index, 1)
    }
    console.log(kosarica, 'Za maknit ', uredaj_id,'index ', index, 'nakon ', upp)

    let q = squel.update().table("korisnici").set("kosara", upp.join(' ')).where(`ID="${req.user.ID}"`)
    db.connection.query(q.toString(), function (err, result, fields) {
        if (err) throw err;
        console.log('uspjeh', result, fields, q.toString())
        res.send(upp)
    });




})


module.exports = router;
