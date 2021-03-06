const mysql = require('mysql');


let db_connected = false

const db_connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "emobiteli"
});
db_connection.connect(function (err) {
    if (err) {
        switch (err.code) {
            case 'ECONNREFUSED':
                db_connected = false
                return console.error('Povezivanje sa bazom podataka neuspjesno', err.code)
        }
    } else {
        console.log("Povezan sa bazom podataka!");
        db_connected = true
    }

});

function connectToDB() {
    let db_connection
    const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "emobiteli"
    });
    db_connection = connection
    connection.connect(function (err) {
        if (err) {
            switch (err.code) {
                case 'ECONNREFUSED':
                    db_connected = false
                    return console.error('Povezivanje sa bazom podataka neuspjesno', err.code)
            }
        } else {
            console.log("Povezan sa bazom podataka!");
            db_connected = true
        }

    });
}

let db_reconnect_interval = setInterval(function () {
    if (!db_connected) return connectToDB()

    clearInterval(db_reconnect_interval)
}, 2000)


exports.db_connection = db_connection; //Konekcija sa bazom, potrebo za query
exports.db_connected = db_connected //Bool dali je povezan server sa bazom
