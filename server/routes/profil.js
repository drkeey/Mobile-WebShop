const express = require('express');
const router = express.Router();
const middlewares = require('../middleware')
//import { authMiddleware } from '../middleware'
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const db = require('../db')

//Middle ware that is specific to this router
router.use(middlewares.authMiddleware);


const db_connection = db.db_connection
router.get('/profil', (req, res) => {
    if (!req.loggedIn) return res.sendStatus(403)

    res.status(200)
    res.send(req.user)
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

    db_connection.query(q.toString(), function (err, result, fields) {
        if (err) throw err;
        console.log(result)
        res.sendStatus(200)
    });
})


module.exports = router;
