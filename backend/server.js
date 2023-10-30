const express = require("express");
const db = require("./database.js")
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const md5 = require("md5")
const dotenv = require('dotenv'); 
const jwt = require('jsonwebtoken');
const auth = require("./middleware");
const crypto = require('crypto');


// Set up Global configuration access 
dotenv.config(); 

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    },
});

io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("join_room", async (data) => {
        console.log("join_room",data)
        socket.join(data);

        try {
            let result = await getPlayers(data);
            io.to(data).emit("set_players", { creator: result.creator, challenger: result.challenger });
        } catch (error) {
            console.error(error);
        }
    });

    socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data);
    });

    socket.on("playAction", async (data) => {
        try {
            let result = await playerAction(data.room);
            io.to(data.room).emit("new_action", { action: result.newAction, game: result.game });
        } catch (error) {
            console.error(error);
        }
    });
});


let PORT = process.env.PORT || 3001; 
server.listen(PORT, () => {
    console.log("SERVER IS RUNNING");
});

// GAME PLAY

async function getPlayers(reference) {
    return new Promise((resolve, reject) => {
        let sql = "SELECT * FROM game WHERE reference = '" + reference + "'";
        let paramsCreator = [];

        db.all(sql, paramsCreator, async function (err, games) {
            if (err) {
                console.log("erreur lors de la récupération de la game");
                console.log(err);
                reject(err);
                return;
            }

            let game = games[0];
            console.log('canPlay 8', true);
            console.log("game.action", game.action);

            // Récupération de l'utilisateur créateur (creatorId)
            let creatorId = game.creator;
            let creatorUser = await getUserById(creatorId);

            // Récupération de l'utilisateur challenger (challengerId)
            let challengerId = game.challenger;
            let challengerUser = await getUserById(challengerId);

            resolve({ creator: creatorUser, challenger: challengerUser });
        });
    });
}

async function getUserById(userId) {
    return new Promise((resolve, reject) => {
        let sql = "SELECT * FROM user WHERE id = " + userId;
        let params = [];

        db.all(sql, params, function (err, users) {
            if (err) {
                console.log("erreur lors de la récupération de l'utilisateur");
                console.log(err);
                reject(err);
                return;
            }
            let user = users[0];
            resolve(user);
        });
    });
}

async function playerAction(reference) {
    return new Promise((resolve, reject) => {
        let sql = "SELECT * FROM game WHERE reference = '" + reference + "'";
        let paramsCreator = [];

        db.all(sql, paramsCreator, function (err, games) {
            if (err) {
                console.log("erreur lors de la récupération de la game");
                console.log(err);
                reject(err);
                return;
            }
            let game = games[0];
            console.log('canPlay 8', true);
            console.log("game.action", game.action);

            let newAction;
            if (game.action === 0) {
                db.run(
                    "UPDATE game SET action=1 WHERE reference=?",
                    [reference],
                    function (err, result) {
                        if (err) {
                            console.log("erreur lors de la mise à jour de la game");
                            console.log(err);
                            reject(err);
                            return;
                        }
                        console.log("Mise à jour effectué avec succès");
                        db.get(
                            "SELECT * FROM game WHERE reference=?",
                            [reference],
                            function (err, game) {
                                if (err) {
                                    console.log("Erreur lors de la récupération des données de la game après l'update");
                                    console.log(err);
                                    reject(err);
                                    return;
                                }
                
                                // Les informations de la game après l'update sont dans la variable 'row'
                                console.log("Informations de la game après l'update :", game);
                                resolve({newAction: 1, game: game});
                            }
                        );
                    }
                );
            } else if (game.action === 1) {
                db.run(
                    "UPDATE game SET action=0 WHERE reference=?",
                    [reference],
                    function (err, result) {
                        if (err) {
                            console.log("erreur lors de la mise à jour de la game");
                            console.log(err);
                            reject(err);
                            return;
                        }
                        console.log("Mise à jour effectué avec succès");
                        db.get(
                            "SELECT * FROM game WHERE reference=?",
                            [reference],
                            function (err, game) {
                                if (err) {
                                    console.log("Erreur lors de la récupération des données de la game après l'update");
                                    console.log(err);
                                    reject(err);
                                    return;
                                }
                
                                // Les informations de la game après l'update sont dans la variable 'row'
                                console.log("Informations de la game après l'update :", game);
                                resolve({newAction: 0, game: game});
                            }
                        );
                        
                    }
                );
            }
        });
    });
}


// API

let bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/api/user/play", (req, res, next) => {
    console.log("req.body.player",req.body.player)
    console.log("req.body.reference",req.body.reference)
    let sqlCreator = "SELECT * FROM user WHERE player = '" + req.body.player + "'";
    let paramsCreator = []
    db.all(sqlCreator, paramsCreator, function (err, user) {
        if (err){
            res.status(400).json({"error": err.message})
            console.log('canPlay 4', false)
            return;
        }
        console.log('canPlay 5', true)
        
        let sql = "SELECT * FROM game WHERE reference = '" + req.body.reference + "'";
        let params = []
        db.all(sql, params, (err, games) => {
            if (err) {
            res.status(400).json({"error":err.message});
            console.log('canPlay 0', false)
            return;
            }
            console.log('canPlay 6', true)
            console.log('games ___', games)

            if(games.length > 0) {
                let game = games[0]
                if(game.creator != null && game.challenger != null) {
                    console.log('canPlay 7', true)
                    res.send({canPlay: true}); 
                }
            }
        });
    });
});

app.post("/api/user/createNewGame", async (req, res) => {
    console.log('generating token')
    try {
        console.log('creator ____ ', "'"+req.body.creator+"'")
        let data = { 
            time: Date('now'),
            gameReference: crypto.randomUUID()
        }
        let sqlCreator = "SELECT * FROM user WHERE player = '" + req.body.creator + "'";
        let paramsCreator = []
        let user = []
        db.all(sqlCreator, paramsCreator, function (err, innerResult) {
            if (err){
                res.status(400).json({"error": err.message})
                return;
            }
            console.log('sqlCreator:', sqlCreator);
            user = innerResult;
            
            let sql = 'INSERT INTO game (creator, reference, action, DateCreated) VALUES (?,?,?,?)';
            let params =[user[0].id, data.gameReference, 0, Date("now")];
            db.run(sql, params, function (err) {
                if (err) {
                    res.status(400).json({"error": err.message});
                    return;
                }

                // Envoyez la réponse au client après avoir inséré le jeu dans la base de données
                res.json({
                    gameId: this.lastID,
                    creator: user[0].id,
                    name: user.name,
                    gameReference: data.gameReference
                });
            });
        });
        

    } catch (err) {
        res.status(400).json({"error": err.message})

        res.send(""); 
    }
});

app.post("/api/user/generateToken", async (req, res) => {
    console.log('generating token')
    try {
        let jwtSecretKey = process.env.JWT_SECRET_KEY; 
        let data = { 
            time: Date('now'),
            name: req.body.name, 
            player: crypto.randomUUID()
        }

        const token = jwt.sign(data, jwtSecretKey, {expiresIn: "1h"}); 

        let sql = 'INSERT INTO user (player, name, token, DateCreated) VALUES (?,?,?,?)';
        let params =[data.player, data.name, token, Date("now")];
        let user = db.run(sql, params, function (err, innerResult) {
            if (err){
                res.status(400).json({"error": err.message})
                return;
            }
        
        });

        res.send({
            token: token, player: data.player, name: data.name
        }); 

    } catch (err) {
        res.status(400).json({"error": err.message})

        res.send("le token n'a pas pu être généré"); 
    }
});

app.post("/api/user/activeGames", (req, res, next) => {
    let sqlCreator = "SELECT * FROM user WHERE player = '" + req.body.creator + "'";
    let paramsCreator = []
    db.all(sqlCreator, paramsCreator, function (err, users) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        console.log("req.body.creator", req.body.creator)
        let user = users[0];
        let sql = "SELECT * FROM game WHERE creator = '" + user.id + "' AND winner IS NULL";
        let params = []
        db.all(sql, params, (err, rows) => {
            if (err) {
            res.status(400).json({"error":err.message});
            return;
            }
            res.send({game: rows, creator: user}); 
        });
    });
    
});

app.post("/api/user/challengeGames", (req, res, next) => {
    let sqlCreator = "SELECT * FROM user WHERE player = '" + req.body.creator + "'";
    let paramsCreator = []
    db.all(sqlCreator, paramsCreator, function (err, user) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        console.log("req.body.creator",req.body.creator)
        let sql = "SELECT * FROM game WHERE challenger = '" + user[0].id + "' AND winner IS NULL";
        let params = []
        db.all(sql, params, (err, rows) => {
            if (err) {
            res.status(400).json({"error":err.message});
            return;
            }
            res.send({game: rows, creator: user}); 
        });
    });
    
});

app.get("/api/user/validateToken", (req, res) => { 

    let tokenHeaderKey = process.env.TOKEN_HEADER_KEY; 
    let jwtSecretKey = process.env.JWT_SECRET_KEY; 

    try {
        const token = req.header(tokenHeaderKey); 
  
        const verified = jwt.verify(token, jwtSecretKey); 
        if(verified){ 
            return res.send("Successfully Verified"); 
        }else{ 
            // Access Denied 
            return res.status(401).send(error); 
        } 
    } catch (error) { 
        // Access Denied 
        return res.status(401).send(error); 
    } 
});

app.get("/api/users", (req, res, next) => {
    let sql = "select * from user where player = 'c216fc63-4df0-4fab-b55b-ca2199118a7b'"
    let params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
      });
});

app.post("/api/user/", (req, res, next) => {
    let errors=[]
    if (!req.body.password){
        errors.push("Vous devez définir un mot de passe");
    }
    if (!req.body.email){
        errors.push("Vous devez définir votre email");
    }
    if (!req.body.token){
        errors.push("Pas de token");
    }
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    let data = {
        name: req.body.name,
        email: req.body.email,
        password : md5(req.body.password)
    }
    let sql ='INSERT INTO user (name, email, password, token) VALUES (?,?,?,?)'
    if(req.body.player) {
        // Nouvelle requête SQL Si l'utilisateur a déjà un playerId
    }
    let params =[data.name, data.email, data.password, data.token]
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
})

app.patch("/api/user/joinNewGame", async (req, res, next) => {
    try {

        let sqlChallenger = "SELECT * FROM user WHERE player = '" + req.body.challenger + "'";
        let paramsChallenger = []

        // try {
        //     let verifyGamePlayers = await new Promise((resolve, reject) => {
        //         db.get("SELECT * FROM game WHERE reference=?", [req.body.reference], function (err, result) {
        //             if (err) {
        //                 reject(err);
        //             }
        //             resolve(result);
        //         });
        //     });

        //     console.log(verifyGamePlayers);

        //     if (verifyGamePlayers.creator || verifyGamePlayers.challenger) {
        //         res.status(200).json({
        //             message: "",
        //             data: verifyGamePlayers,
        //             canPlay: true
        //         });
        //         console.log("Ce joueur ne peux pas jouer")
        //         return; // Arrête l'exécution du code ici
        //     }
            
        // } catch (error) {
        //     // Access Denied
        //     console.log(error)
        // } 
        
        db.all(sqlChallenger, paramsChallenger, function (err, users) {
            if (err){
                res.status(400).json({"error": err.message})
                return;
            }

            let user = users[0]
            console.log('users ______ ', users)

            var data = {
                challenger: user.id,
                challengerName: user.name,
                reference: req.body.reference
            }
            console.log(data)
            db.run(
                "UPDATE game SET challenger=?, challengerName=? WHERE reference=?",
                [data.challenger, data.challengerName, data.reference],
                function (err, result) {
                    if (err){
                        res.status(400).json({"error": res.message})
                        return;
                    }
                    console.log(result)
                    res.send({
                        message: "success",
                        data: data,
                        changes: this.changes,
                        canPlay: true
                    })
            });
        });
    } catch (error) { 
        // Access Denied 
        return res.status(401).send(error); 
    } 
    
})

app.patch("/api/user/:id", (req, res, next) => {
    var data = {
        name: req.body.name,
        email: req.body.email,
        password : req.body.password ? md5(req.body.password) : null
    }
    db.run(
        `UPDATE user set 
           name = COALESCE(?,name), 
           email = COALESCE(?,email), 
           password = COALESCE(?,password) 
           WHERE id = ?`,
        [data.name, data.email, data.password, req.params.id],
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({
                message: "success",
                data: data,
                changes: this.changes
            })
    });
})

app.delete("/api/user/deleteGame/:id", (req, res, next) => {
    db.run(
        'DELETE FROM game WHERE id = ?',
        req.params.id,
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({"message":"deleted", changes: this.changes})
    });
})

app.delete("/api/user/:id", (req, res, next) => {
    db.run(
        'DELETE FROM user WHERE id = ?',
        req.params.id,
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({"message":"deleted", changes: this.changes})
    });
})