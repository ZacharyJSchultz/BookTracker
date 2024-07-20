const express = require('express');
const cors = require('cors');
const mysql = require(mysql);

const app = express();

app.use(cors());
app.use(express.json());

app.get('/message', (req, res) => {
    res.json({ message: "This is a test!" });
});

app.listen(8000, () => {
    console.log(`Server is running on port 8000.`);
  });

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password"
});

con.connect(function(err) {
    if (err)
        throw err;
    console.log("Connection Successful!");

    con.query('SET SCHEMA \'booktracker\' SELECT * FROM Books', function(err, rslt) {
        if (err)
            throw err;
        console.log("Result: " + rslt)

        app.get('/message', (req, res) => {
            res.json({ message: result });
        });
    })
});