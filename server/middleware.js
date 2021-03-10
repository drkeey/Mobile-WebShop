const jwt = require('jsonwebtoken');
const squel = require('squel')
const CryptoJS = require("crypto-js");
const db = require('./db')

module.exports = {
    authMiddleware: (req, res, next) => {
        console.log(db.db_connected)
        if (!db.connected) return res.sendStatus(500)

        let db_connection = db.connection

        console.log('hasiram')
        if (!req.headers.authorization) {
            res.sendStatus(403)
            return res.send('Potrebna autorizacija za pregled')
        }
        const token = req.headers.authorization.replace('Bearer ', '')

        try {
            var decoded = jwt.verify(token, '123');
            console.log(decoded)
            let q = squel.select().from("korisnici").where(`korisnicko_ime="${decoded.username}"`)
            db_connection.query(q.toString(), function (err, result, fields) {
                if (err) throw err;
                if (result.length > 0) {
                    console.log('Imaga')
                    //REQ
                    let decrypted = CryptoJS.AES.decrypt(decoded.password, '123')
                    let str = decrypted.toString(CryptoJS.enc.Utf8);
                    //DB
                    let decryptedDB = CryptoJS.AES.decrypt(result[0].lozinka, '123')
                    let strDB = decryptedDB.toString(CryptoJS.enc.Utf8);

                    if (str !== strDB) return res.sendStatus(404)

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
            console.log('NEVALJA TOKEN')
            req.loggedIn = false

            return next()
        }
    }
}

