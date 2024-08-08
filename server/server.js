const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    port: 13306,
    database: "BookTracker"
});

con.connect(function(err) {
    if (err)
        throw err;
    console.log("Connection Successful!");

    con.query('SELECT * FROM Books', function(err, rslt) {
        if (err)
            throw err;
        console.log("Result:\n")
        console.log("Title: " + rslt[0]['title'])
        console.log("Author(s): " + rslt[0]['author'])
        console.log("Genre(s): " + rslt[0]['genres'])
        console.log("Rating: " + rslt[0]['rating'])
        console.log("Date Completed: " + String(rslt[0]['dateCompleted']).substring(0, 21))

        app.get('/message', (req, res) => {
            res.json({ message: JSON.stringify(rslt) });
            console.log(JSON.stringify(rslt));
        });
    })
});

app.use(cors());
app.use(express.json());

/*app.get('/message', (req, res) => {
    res.json({ message: "This is a test!" });
});*/

app.listen(8000, () => {
    console.log(`Server is running on port 8000.`);
  });