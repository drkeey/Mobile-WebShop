const mysql = require('mysql');

module.exports = {
    connection: null, //Za query
    connected: false, //Povezan sa bazom?

    get getConnection(){
        return this.connection
    },
    get getConnected(){
        return this.connected
    },

    set setConnection(con){
        this.connection = con
    },
    set setConnected(bool){
        this.connected = bool
    },
    
    connectToDB: function () {
        let instance = this

        const connection = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "",
            database: "emobiteli"
        });
        instance.setConnection = connection   

        let interval = setInterval(function () {
            connection.connect(function (err) {
                if (err) {
                    switch (err.code) {
                        case 'ECONNREFUSED':
                            instance.setConnected = false
                            return console.error('Povezivanje sa bazom podataka neuspjesno', err.code)
                    }
                } else {
                    instance.setConnected = true
                    console.log("Povezan sa bazom podataka!");
                    clearInterval(interval)
                }
            });
        }, 1000)
    }

}; //Konekcija sa bazom, potrebo za query
// exports.db_connected = db_connected //Bool dali je povezan server sa bazom
