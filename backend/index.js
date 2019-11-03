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

app.get('/update_category_database', (req, res) => {
    let db = new sqlite3.Database('./db/database.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
        if (err) {
          console.log(err.message);
        }
        console.log('Connected to the in-memory SQlite database.');
    });

   //db.run('CREATE TABLE trivia (name TEXT, id INT)');
    
    var expected = 18500;
    var e_count = 0;
    var count = 0;
    while (true) {
        request('http://jservice.io/api/categories/?count=100&offset=' + String(e_count), function (error, response, body) {
            if (!error && response.statusCode == 200) {
                body = JSON.parse(body);
                body.forEach(function(cat) {
                    db.run(`INSERT INTO trivia VALUES(?, ?)`, [String(cat['title']), cat['id']], function(err) {
                        if (err) {
                          console.log(err.message);
                        }
                        else {
                            console.log(count)
                            console.log(cat)
                            count = count + 1;
                            if (count == expected) {
                                db.close((err) => {
                                    if (err) {
                                        console.log(err.message);
                                    }
                                    console.log('Closed the database connection.');
                                });
                                return;
                            }
                        }
                    });
                });
        }});
        e_count += 100;
        if (e_count === expected) {
            break;
        }
    }
});

app.get('/search/:difficulty?/:category?/:date_start?/:date_end?', (req, res) => {
    var date_start = req.query.date_start;
    var date_end = req.query.date_end;
    var category = req.query.category;
    var difficulty = req.query.difficulty;

    if (difficulty === undefined && category === undefined && date_end === undefined && date_start === undefined) {
        r = (Math.random() - 1) * 5000
        request('http://jservice.io/api/random/?offset=' + String(r), function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.json(body);
        }});
    } else {
        var api_endpoint = 'http://jservice.io/api/clues/?'
        difficulty = parseInt(difficulty);
        if (difficulty !== undefined) {
            if (difficulty === 100 || difficulty === 200 || difficulty === 400 || difficulty === 300 || difficulty === 500 || difficulty === 600 || difficulty === 800 || difficulty === 1000) {
                api_endpoint += 'value=' + String(difficulty) + '&';
            }
        }

        if (date_end !== undefined && date_end != "" && date_start !== undefined && date_start != "") {
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
        } else {
            if (date_end !== undefined && date_end != "") {
                var fields = date_end.split('/');
                date_end = String(fields[2]) + '-' + String(fields[1]) + '-' + String(fields[0])
                api_endpoint += 'min_date=' + String(date_end) + '&';
            }
    
            if (date_start !== undefined && date_start != "") {
                var fields = date_start.split('/');
                date_start = String(fields[2]) + '-' + String(fields[1]) + '-' + String(fields[0])
                api_endpoint += 'max_date=' + String(date_start) + '&';
            }
        }

        if (category !== undefined && category !== "" && category.length !== 0) {
            let db = new sqlite3.Database('./db/database.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
                if (err) {
                  console.log(err.message);
                }
                console.log('Connected to the in-memory SQlite database.');
            });

            let query = `SELECT * FROM trivia WHERE name LIKE ?`;
            
            db.all(query, ['%' + String(category) + '%'], (err, row) => {
                api_endpoint += 'category=' + String(row[Math.floor(Math.random() * row.length)]['id']);
                if (api_endpoint !== 'http://jservice.io/api/clues/?') {
                    console.log(api_endpoint)
                    request(api_endpoint, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        body = JSON.stringify(shuffle(JSON.parse(body)));
                        res.json(body);
                    }});
                }
            });

            db.close((err) => {
                if (err) {
                    console.log(err.message);
                }
                console.log('Closed the database connection.');
            });
        }

        if (api_endpoint !== 'http://jservice.io/api/clues/?' && (category===undefined||category==="")) {
            console.log(api_endpoint)
            api_endpoint = api_endpoint.substring(0, api_endpoint.length - 1);
            request(api_endpoint, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                body = JSON.stringify(shuffle(JSON.parse(body)));
                res.json(body);
            }});
        }
    }
}); 

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));