const pool = require('./db');
const bcrypt = require("bcryptjs");

module.exports = function routes(app, logger) {
    app.get('/', (req, res) => {
        res.status(200).send('test');
    });
}