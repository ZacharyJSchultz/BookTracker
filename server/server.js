const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
const bodyParser = require("body-parser");  // For parsing submit-form JSON

const app = express();

app.use(bodyParser.json());

// Connect to back-end DB
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

    /*con.query('SELECT * FROM Books', function(err, rslt) {
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
    })*/

    app.post('/submit-form', (req, res) => {
        const formData = req.body;

        // Store form data to file, as test
        const filePath = path.join(__dirname, 'form-data.json');

        // Write to file
        fs.writeFile(filePath, JSON.stringify(formData, null, 2), (err) => {
            if (err) {
                console.log("Error writing file:", err);
                return res.status(500).send("Error writing file");
            }

            return res.status(200).send("Form data successfully written to file!");
        });
    });
});

app.use(cors());
app.use(express.json());

// Handle form submission, and send to database

/*app.get('/message', (req, res) => {
    res.json({ message: "This is a test!" });
});*/

app.listen(8000, () => {
    console.log(`Server is running on port 8000.`);
  });