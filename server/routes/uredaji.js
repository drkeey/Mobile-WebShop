const express = require('express');
const router = express.Router();
const db = require('../db')
const squel = require('squel')
const middlewares = require('../middleware')



//Rute za uredaje
router.get('/', (req, res) => {
    console.log(db.connected)
    if (!db.connected()) return res.sendStatus(500)

    let q = squel.select().from("uredaji")

    db.connection().query(q.toString(), function (err, result, fields) {
        if (err) { throw err };
        console.log('Slanje svih uredaja', result)
        res.send(result)
    });

})
//Filtriranje uredaja
router.post('/filter', (req, res) => {
    if (!db.connected()) return res.sendStatus(500)

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

    db.connection().query(q.toString(), function (err, result, fields) {
        if (err) throw err;
        console.log('Saljem filtrirane uređaje', result)
        res.send(result)
    });

})


module.exports = router;
