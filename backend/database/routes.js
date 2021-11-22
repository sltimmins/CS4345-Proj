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


}