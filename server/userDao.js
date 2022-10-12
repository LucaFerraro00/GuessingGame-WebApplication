'use strict';


const db = require('./dbManager');
const crypto = require('crypto');

exports.getUserById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM utenti WHERE id = ?';
      db.get(sql, [id], (err, row) => {
        if (err) 
          reject(err);
        else if (row === undefined)
          resolve({error: 'User not found.'});
        else {
          // by default, the local strategy looks for "username": not to create confusion in server.js, we can create an object with that property
          const user = {id: row.id, username: row.email, name: row.nome, surname: row.cognome, score:row.score}
          resolve(user);
        }
    });
  });
};



exports.getUser = (email, password) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM utenti WHERE email = ?';
      db.get(sql, [email], (err, row) => {
        if (err) { reject(err); }
        else if (row === undefined) { resolve(false); }
        else {
          const user = {id: row.id, username: row.email, name: row.nome, surname: row.cognome, score: row.score};
          
          const salt = row.salt;
          crypto.scrypt(password, salt, 32, (err, hashedPassword) => {
            if (err) reject(err);

            const passwordHex = Buffer.from(row.password, 'hex');

            if(!crypto.timingSafeEqual(passwordHex, hashedPassword))
              resolve(false);
            else resolve(user); 
          });
        }
      });
    });
  };

  exports.updateScore = (newScore, userId) => {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE utenti SET  score=? WHERE id = ?';
      db.run(sql, [newScore ,userId], function (err) {  
        if (err) {
          reject(err);
          return;
        }
        resolve(this.lastID);
      });
    });
  };

  exports.getTopScores = () => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT DISTINCT score FROM utenti ORDER BY score DESC LIMIT 3';
      db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        const utenti = rows;
        resolve(utenti);
      });
    });
  };


  exports.getTopUsers = (target) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM utenti WHERE score>=? ORDER BY score DESC';
      db.all(sql, [target], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        const utenti = rows;
        resolve(utenti);
      });
    });
  };