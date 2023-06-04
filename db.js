const mysql = require('mysql');

const con = mysql.createConnection({
    host: "database-1.csd525txjwzl.us-east-2.rds.amazonaws.com",
    port: "3306",
    user: "admin",
    password: "wizu2JPzoPw675JlwrPG",
    database: "regent1",
    multipleStatements: true
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

module.exports = con

