var sqlite3 = require('sqlite3').verbose()
var md5 = require('md5')

const DBSOURCE = "db.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            player text NOT NULL UNIQUE,
            name text,
            password text,
            token text,
            DateCreated DATE
            )`,
        (err) => {
            if (err) {
                // Table already created
            }else{
                // Table just created, creating some rows
                var insert = 'INSERT INTO user (name, player, DateCreated) VALUES (?,?,?)';
                db.run(insert, ["user", "testplayer", Date("now")])
            }
        }); 

        db.run(`CREATE TABLE game(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            creator INTEGER NOT NULL,
            challenger INTEGER,
            challengerName TEXT,
            action INTEGER NOT NULL,
            reference TEXT NOT NULL UNIQUE,
            winner INTEGER,
            DateCreated DATE
        )`,
        (err) => {
            if (err) {
                // Table already created
            }else{
                // Table just created, creating some rows
                var insert = 'INSERT INTO game (creator, reference, action, DateCreated) VALUES (?,?,?,?)';
                db.run(insert, [1,'testreference', 0, Date("now")])
            }
        });

        db.run(`CREATE TABLE board(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            game_id INTEGER NOT NULL,
            board TEXT NOT NULL,
            DateCreated DATE,
            FOREIGN KEY(game_id) REFERENCES game(id)
            
        )`,
        (err) => {
            if (err) {
                // Table already created
            }else{
                // Table just created, creating some rows

                let initialBoard = [
                    ["E", "E", "E", "E", "E", "E", "E"],
                    ["E", "E", "E", "E", "E", "E", "E"],
                    ["E", "E", "E", "E", "E", "E", "E"],
                    ["E", "E", "E", "E", "E", "E", "E"],
                    ["E", "E", "E", "E", "E", "E", "E"],
                    ["E", "E", "E", "E", "E", "E", "E"]
                ];
                var insert = 'INSERT INTO board (game_id, board, DateCreated) VALUES (?,?,?)';
                db.run(insert, [1, JSON.stringify(initialBoard), Date("now")], (err) => {
                    if (err) {
                        // Table already created
                        console.log("____ERREUR lors de l'ajout test dans board _____", err)
                    }
                })
            }
        });
    }
});


module.exports = db