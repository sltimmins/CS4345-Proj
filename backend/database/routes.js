const pool = require('./db');
const bcrypt = require("bcryptjs");

module.exports = function routes(app, logger) {
    app.get('/', (req, res) => {
        res.status(200).send('test');
    });

    app.post("/users/noDimensions", (req, res) => {
        // obtain a connection with server
        // if there is no error obtaining a connection
        const username = req.body.username;
        const password = req.body.password;
        const saltRounds = 10;
    
        const error = (err) => {
            logger.error("Error adding new user: \n", err);
            res.status(400).send({
                success: false,
                msg: "There was an error creating your user.",
            });
        };
    
        bcrypt.genSalt(saltRounds, (err, salt) => {
            if (err) {
                error(err);
                return;
            }
            bcrypt.hash(password, salt, (err, hash) => {
                if (err) {
                    error(err);
                    return;
                }

                const sql = "INSERT INTO fitfindr.users (username, password) VALUES(?, ?)";

                pool.query(sql, [username, hash], (err, result) => {
                    if (err) {
                        error(err);
                        return;
                    }
                    res.status(200).send({
                        success: true,
                        data: { id: result.insertId, username },
                    });
                });
            });
        });
    });

    app.post("/users/dimensions", (req, res) => {
        // obtain a connection with server
        // if there is no error obtaining a connection
        const username = req.body.username;
        const password = req.body.password;
        const chest = req.body.chest;
        const height = req.body.height;
        const hip = req.body.hip;
        const gender = req.body.gender;
        const sleeveLength = req.body.sleeveLength;
        const neck = req.body.neck;
        const saltRounds = 10;
    
        const error = (err) => {
            logger.error("Error adding new user: \n", err);
            res.status(400).send({
                success: false,
                msg: "There was an error creating your user.",
            });
        };
    
        bcrypt.genSalt(saltRounds, (err, salt) => {
            if (err) {
                error(err);
                return;
            }
            bcrypt.hash(password, salt, (err, hash) => {
                if (err) {
                    error(err);
                    return;
                }

                const sql = "INSERT INTO fitfindr.users (username, password, chest, height, hip, sleeveLength, neck, gender) VALUES(?, ?, ?, ?, ?, ?, ?, ?)";

                pool.query(sql, [username, hash, chest, height, hip, sleeveLength, neck, gender], (err, result) => {
                    if (err) {
                        error(err);
                        return;
                    }
                    res.status(200).send({
                        success: true,
                        data: { id: result.insertId, username },
                    });
                });
            });
        });
    });

    app.post("/login", (req, res) => {
        // if there is no issue obtaining a connection, execute query and release connection
        const username = req.body.username;
        var sql = "SELECT * FROM fitfindr.users WHERE username = ?";
        pool.query(sql, [username], (err, rows) => {
            if (err || !rows.length) {
                logger.error("Error while username salt: \n", err);
                res.status(400).send({ 
                    success: false, 
                    msg: "Invalid username or password" 
                });
            } else {
                const hash = rows[0]["password"];
                const password = req.body.password;
        
                bcrypt.compare(password, hash, (err, result) => {
                    if (result && !err) {
                        let id = rows[0]["id"];
                        let username = rows[0]["username"];
                        let chest = rows[0]["chest"];
                        let height = rows[0]["height"];
                        let hip = rows[0]["hip"];
                        let sleeveLength = rows[0]["sleeveLength"];
                        let neck = rows[0]["neck"];
                        let gender = rows[0]["gender"];

                        res.status(200).send({
                            success: true,
                            data: { id: id, 
                                    username: username, 
                                    chest: chest, 
                                    height: height, 
                                    hip: hip, 
                                    sleeveLength: sleeveLength, 
                                    neck: neck, 
                                    gender: gender 
                            }
                        });
                    } else {
                        logger.error("Error no matching password: \n", err);
                        res.status(400).send({
                            success: false,
                            msg: "Incorrect username or password"
                        });
                    }
                });
            }
        });
    });
}