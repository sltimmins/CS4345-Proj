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
        const measurementDimensions = req.body.measurementDimensions;
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

                const sql = "INSERT INTO fitfindr.users (username, password, chest, height, hip, sleeveLength, neck, gender, measurementDimensions) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)";

                pool.query(sql, [username, hash, chest, height, hip, sleeveLength, neck, gender, measurementDimensions], (err, result) => {
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
                        let measurementDimensions = rows[0]["measurementDimensions"];

                        res.status(200).send({
                            success: true,
                            data: { id: id, 
                                    username: username, 
                                    chest: chest, 
                                    height: height, 
                                    hip: hip, 
                                    sleeveLength: sleeveLength, 
                                    neck: neck, 
                                    gender: gender,
                                    measurementDimensions: measurementDimensions
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

    app.get("/info", (req, res) => {
        const id = req.query.id;

        const sql = "SELECT chest, height, hip, sleeveLength, neck, gender FROM fitfindr.users WHERE id = ?";
        pool.query(sql, [id], (err, results) => {
            if (err) {
                logger.error("Error retrieving sizing: \n", err);
                res.status(400).send({
                  success: false,
                  msg: "Error retrieving sizing",
                });
            } else {
                res.status(200).send({ success: true, data: results });
            }
        })
    })

    app.put("/updateSizes", (req, res) => {
        const id = req.body.id;
        
        pool.query("SELECT chest, height, hip, gender, sleeveLength, neck FROM fitfindr.users WHERE id = ?", [id], (err, results) => {
            console.log(results[0].chest);
            const chest = req.body.chest || results[0].chest;
            const height = req.body.height || results[0].height;
            const hip = req.body.hip || results[0].hip;
            const gender = req.body.gender || results[0].gender;
            const sleeveLength = req.body.sleeveLength || results[0].sleeveLength;
            const neck = req.body.neck || results[0].neck;
            const measurementDimensions = req.body.measuring || results[0].measurementDimensions;
            
            const sql = "UPDATE fitfindr.users SET chest = ?, height = ?, hip = ?, gender = ?, sleeveLength = ?, neck = ?, measurementDimensions = ? WHERE id = ?"
            pool.query(sql, [chest, height, hip, gender, sleeveLength, neck, measurementDimensions, id], (err, results) => {
                if(err) {
                    logger.error("Error updating sizes", err);
                    res.status(400).send({ success: false, msg: "Error updating sizes" });
                } else {
                    res.status(200).send({ success: true, data: results });
                }
            })
        })
    })
}