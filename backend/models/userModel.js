const db = require("../config/db");
const findUserByEmail = (email, callback) => {
    const sql = `
        SELECT * FROM users
        WHERE email = ?
    `;
    db.query(sql, [email], (err, result) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, result[0]);
    });
};

const createUser = (name, email, password,role, callback) => {
    const sql = `
        INSERT INTO users (name, email, password,role)
        VALUES (?, ?, ?,?)
    `;
    db.query(
        sql,
        [name, email, password,role],
        callback
    );
};
module.exports = {
    findUserByEmail,
    createUser
};