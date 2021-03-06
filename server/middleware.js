const jwt = require('jsonwebtoken');
const squel = require('squel')
const mysql = require('mysql');

const db = require('./db')

module.exports = {
    authMiddleware: function authMiddleware(req, res, next) {
        console.log(db.db_connected)
        if (!db.db_connected) return res.sendStatus(500)
       
        let db_connection = db.db_connection

        console.log('hasiram')
        if (!req.headers.authorization){
            res.sendStatus(403)
            return res.send('Potrebna autorizacija za pregled')
        } 
        const token = req.headers.authorization.replace('Bearer ', '')

        try {
            var decoded = jwt.verify(token, '123');
            console.log(decoded)
            let q = squel.select().from("korisnici").where(`korisnicko_ime="${decoded.username}"`).where(`lozinka="${decoded.password}"`)
            db_connection.query(q.toString(), function (err, result, fields) {
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
            console.log('NEVALJA TOKEN', err)
            req.loggedIn = false

            res.sendStatus(403)
        }
    }
}

