const express = require('express');
const router = express.Router();
const middlewares = require('../middleware')
const db = require('../db')
const squel = require('squel')
const path = require('path')
var multer = require('multer')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/profilne_slike/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
    }
})

//Middle ware that is specific to this router
router.use(middlewares.authMiddleware);
function uploadFile(req, res, next) {
    if (!req.loggedIn) return res.sendStatus(403)

    const upload = multer({ storage: storage }).single('profilna');
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            console.log('Problem sa uploadanjem profilne slike', err)
            return res.status(500).send('Problem sa uploadanjem profilne slike')

        } else if (err) {
            console.log('Multer error', err)
            return res.status(500).send('Nepoznati error')
        }
        // Everything went fine.
        console.log('Slika uspješno postavljena.')
        next()
    })
}



router.get('/', (req, res) => {
    //console.log('gas', req.user)
    if (!req.loggedIn) return res.sendStatus(403)
    res.send({
        korisnicko_ime: req.user.korisnicko_ime,
        lozinka: 'Tajna',
        slika: req.user.slika,
        email: req.user.email,
        adresa: req.user.adresa,
        postanski_broj: req.user.postanski_broj,
        opcina: req.user.opcina,
        tip: req.user.tip
    })
})

router.get('/profilna', (req, res) => {
    if (!req.loggedIn) return res.sendStatus(403)
    res.send('http://localhost:4000/profilne_slike/' + req.user.slika)
})

router.post('/uploadImage', uploadFile, (req, res) => { //Profilna
    if (!req.loggedIn) return res.sendStatus(403)

    console.log(req.file, req.body, req.headers)

    let q = squel.update()
        .table("korisnici")
        .set(`slika="${req.file.filename}"`)
        .where(`ID="${req.user.ID}"`)
        .toString()

    db.connection().query(q.toString(), function (err, result, fields) {
        if (err) throw err;
        console.log(result)
        res.sendStatus(200)
    });
})

router.post('/updateProfile', (req, res) => {
    if (!req.loggedIn) return res.sendStatus(403)
    //console.log(req.body)

    let q = squel.update()
        .table("korisnici")
        .set(`adresa="${req.body.adresa}"`)
        .set(`postanski_broj="${req.body.postanski_broj}"`)
        .set(`opcina="${req.body.opcina}"`)
        .where(`lozinka="${req.user.lozinka}"`)
        .toString()

    db.connection().query(q.toString(), function (err, result, fields) {
        if (err) throw err;
        //console.log(result)
        res.sendStatus(200)
    });
})


module.exports = router;
