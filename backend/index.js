const express = require('express');
const path = require('path');
const request = require('request');
const request_sync = require('sync-request');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(cors());

// Define port being used
const PORT = process.env.PORT || 5000;

// app.get('/update_category_database', (req, res) => {
//     let db = new sqlite3.Database('./db/database.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
//         if (err) {
//           console.log(err.message);
//         }
//         console.log('Connected to the in-memory SQlite database.');
//     });
//     db.run('CREATE TABLE categories(name id)');
//     var count = 0;
//     while (true) {
//         request('http://jservice.io/api/categories/?count=100&offset=' + String(count), function (error, response, body) {
//             if (!error && response.statusCode == 200) {
//                 body = JSON.parse(body);
//                 for (cat in body) {
//                     db.run(`INSERT INTO categories(name) VALUES(?)`, ['C'], function(err) {
//                         if (err) {
//                           return console.log(err.message);
//                         }
//                         // get the last insert id
//                         console.log(`A row has been inserted with rowid ${this.lastID}`);
//                     });
//                     console.log(body[cat].title);
//                 }
//                 c = c + 1;
//         }});
//         if (count == 20000) {
//             break;
//         }
//         count = count + 100;
//     }
//     db.close((err) => {
//         if (err) {
//             console.log(err.message);
//         }
//         console.log('Close the database connection.');
//     });
// });

app.get('/search/:difficulty?/:category?/:date_start?/:date_end?', (req, res) => {
    var date_start = req.query.date_start;
    var date_end = req.query.date_end;
    var category = req.query.category;
    var difficulty = req.query.difficulty;

    if (difficulty === undefined && category === undefined && date_end === undefined && date_start === undefined) {
        r = (Math.random() - 1) * 1000
        request('http://jservice.io/api/random/?offset=' + String(r), function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.json(body);
        }});
    } else {
        var api_endpoint = 'http://jservice.io/api/clues/?'
        difficulty = parseInt(difficulty);
        if (difficulty !== undefined) {
            if (difficulty === 100 || difficulty === 200 || difficulty === 400 || difficulty === 600 || difficulty === 800 || difficulty === 1000) {
                api_endpoint += 'value=' + String(difficulty) + '&';
            }
        }

        if (date_end !== undefined && date_end != "") {
            var fields = date_end.split('/');
            date_end = String(fields[2]) + '-' + String(fields[1]) + '-' + String(fields[0])
            api_endpoint += 'max_date=' + String(date_end) + '&';
        }

        if (date_start !== undefined && date_start != "") {
            var fields = date_start.split('/');
            date_start = String(fields[2]) + '-' + String(fields[1]) + '-' + String(fields[0])
            api_endpoint += 'min_date=' + String(date_start) + '&';
        }
        
        if (api_endpoint !== 'http://jservice.io/api/clues/?') {
            api_endpoint = api_endpoint.substring(0, api_endpoint.length - 1);
            console.log(api_endpoint);
            request(api_endpoint, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                res.json(body);
            }});
        }
    }
}); 

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));