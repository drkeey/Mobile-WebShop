const express = require('express');
const router = express.Router();
const middlewares = require('../middleware')
const db = require('../db')
const squel = require('squel')

//Middle ware that is specific to this router
router.use(middlewares.authMiddleware);

router.get('/', (req, res) => {
    console.log('gas', req.user)
    if (!req.loggedIn) return res.sendStatus(403)
    res.send({
        korisnicko_ime: req.user.korisnicko_ime,
        lozinka: 'Tajna',
        email: req.user.email,
        adresa: req.user.adresa,
        postanski_broj: req.user.postanski_broj,
        opcina: req.user.opcina,
        tip: req.user.tip
    })
})

router.post('/uploadImage', (req, res) => {
    if (!req.loggedIn) return res.sendStatus(403)
    console.log(req.body)

    let q = squel.update()
        .table("korisnici")
        .set(`adresa="${req.body.adresa}"`)
        .set(`postanski_broj="${req.body.postanski_broj}"`)
        .set(`opcina="${req.body.opcina}"`)
        .where(`lozinka="${req.user.lozinka}"`)
        .toString()

    db.connection.query(q.toString(), function (err, result, fields) {
        if (err) throw err;
        console.log(result)
        res.sendStatus(200)
    });
})

router.post('/updateProfile', (req, res) => {
    if (!req.loggedIn) return res.sendStatus(403)
    console.log(req.body)

    let q = squel.update()
        .table("korisnici")
        .set(`adresa="${req.body.adresa}"`)
        .set(`postanski_broj="${req.body.postanski_broj}"`)
        .set(`opcina="${req.body.opcina}"`)
        .where(`lozinka="${req.user.lozinka}"`)
        .toString()

    db.connection.query(q.toString(), function (err, result, fields) {
        if (err) throw err;
        console.log(result)
        res.sendStatus(200)
    });
})


module.exports = router;
