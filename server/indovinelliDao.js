

const db = require('./dbManager');

//post new indovinello
exports.createIndovinello = (indovinello, userId) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO indovinelli( domanda, difficolta, durata, risposta, primo_suggerimento, secondo_suggerimento, stato, userId) \
                    VALUES( ?, ?, ?, ?, ?, ?, ?, ?)';
        db.run(sql,
            [ indovinello.domanda, indovinello.difficolta, indovinello.durata,
            indovinello.risposta, indovinello.primo_suggerimento, indovinello.secondo_suggerimento, indovinello.stato, userId], function (err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
    });
};

//post risposta
exports.addRisposta = (userId, indovinelloId,  risposta) => {
  return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO risposte( userId, indovinelloId, risposta ) \
                  VALUES( ?, ?, ?)';
      db.run(sql,
          [ userId, indovinelloId, risposta], function (err) {
              if (err) {
                  reject(err);
                  return;
              }
              resolve(this.lastID);
          });
  });
};


exports.updateVincitore = (newVincitore, indovinelloId) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE indovinelli SET  vincitore=?, stato=? WHERE id = ?';
    db.run(sql, [newVincitore , 'chiuso', indovinelloId], function (err) {  
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
};


exports.updateStatoChiuso = (indovinelloId) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE indovinelli SET stato=? WHERE id = ?';
    db.run(sql, ['chiuso', indovinelloId], function (err) {  
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
};


exports.updateOraInizio = (oraInizio, indovinelloId) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE indovinelli SET  inizio=? WHERE id = ?';
    db.run(sql, [oraInizio , indovinelloId], function (err) {  
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
};

// get all indovinelli 
exports.allIndovinelli = () => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM indovinelli';
      db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        const indovinelli = rows.map((indovinello) => {
          if(indovinello.stato==='chiuso')
          {return ( 
            { domanda: indovinello.domanda, 
            id: indovinello.id,
            difficolta: indovinello.difficolta, 
            durata: indovinello.durata,
            stato: indovinello.stato,
            risposta: indovinello.risposta, 
            tentativi: indovinello.tentativi,
            vincitore: indovinello.vincitore ,
            userId: indovinello.userId,
            inizio: indovinello.inizio})}
          else {return(
            { domanda: indovinello.domanda, 
              id: indovinello.id,
              difficolta: indovinello.difficolta, 
              durata: indovinello.durata,
              stato: indovinello.stato,
              risposta: '', 
              tentativi: '',
              vincitore: indovinello.vincitore ,
              userId: indovinello.userId,
              inizio: indovinello.inizio}
          ) }
            });
        resolve(indovinelli);
      });
    });
  };

  exports.indovinelloById = (id) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT id, domanda, difficolta, durata, stato, userId, vincitore, inizio FROM indovinelli WHERE id =?';
      db.get(sql, [id], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(row);
      });
    });
  };

  exports.getPrimoSugById = (id) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT primo_suggerimento FROM indovinelli WHERE id =?';
      db.get(sql, [id], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        resolve({primo_suggerimento: row.primo_suggerimento});
      });
    });
  };

  exports.getSecondoSugById = (id) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT secondo_suggerimento FROM indovinelli WHERE id =?';
      db.get(sql, [id], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        resolve({secondo_suggerimento: row.secondo_suggerimento});
      });
    });
  };

  exports.getRispostaCorrettaById = (id) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT risposta FROM indovinelli WHERE id =?';
      db.get(sql, [id], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        resolve({rispostaCorretta: row.risposta});
      });
    });
  };




  exports.getRispostaById = (indovinelloId, userId) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM risposte WHERE userId =? AND indovinelloId=?';
      db.get(sql, [userId, indovinelloId], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(row);
      });
    });
  };


  exports.getRisposteByIndovinelloId = (indovinelloId) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM risposte WHERE indovinelloId=?';
      db.all(sql, [indovinelloId], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows);
      });
    });
  };