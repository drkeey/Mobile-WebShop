const mysql = require('mysql');

const config = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'emobiteli'
}
//let connection = undefined
let connection
let connected = false //Povezan sa bazom?
//let connection = _this.connection
function connect() {
    let _connection = mysql.createConnection(config)
    _connection.connect(function (err) {
        if (err) {
            connected = false
            console.log('Povezivanje sa bazom podataka neuspješno.');
            return setTimeout(connect, 3000);
        }
        connection = _connection
        connected = true
        console.log('Povezano za bazom.')
    });
}
connect()
 //Konekcija sa bazom, potrebo za query
// exports.db_connected = db_connected //Bool dali je povezan server sa bazom

module.exports = {
    connected: function(){
        return connected
    },
    connection: function(){
        return connection
    },
}