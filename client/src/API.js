
const APIURL = new URL('http://localhost:3001/api/');  



async function getIndovinelloById(id) {
  const response = await fetch(new URL('indovinello/'+id, APIURL), {credentials: 'include'});
  const indovinelloJson = await response.json();
  if (response.ok) {
      return  ({  
        id: indovinelloJson.id,
        domanda: indovinelloJson.domanda, 
        difficolta: indovinelloJson.difficolta,
        stato : indovinelloJson.stato,
        durata: indovinelloJson.durata,
        vincitore : indovinelloJson.vincitore,
        inizio: indovinelloJson.inizio,
     })
  } else {
    throw indovinelloJson;  // restituisce un oggetto con l'errore che genera un server
  }
}


async function getRispostaById(indovinelloId) {
  const response = await fetch(new URL('risposta/'+indovinelloId, APIURL), {credentials: 'include'})
  if (response.ok) {
      return  (response)
  } else {
    throw response;  // l'oggetto response poi non viene usato, serve solo per lanciare l'eccezione.
  }
}

async function getIndovinelloRisposteById(id) {
  const response = await fetch(new URL('indovinelloRisposte/'+id, APIURL), {credentials: 'include'});
  const indovinelloJson = await response.json();
  if (response.ok) {
      return  ({  
        id: indovinelloJson.id,
        domanda: indovinelloJson.domanda, 
        stato : indovinelloJson.stato,
        durata: indovinelloJson.durata,
        inizio: indovinelloJson.inizio,
        tentativi: indovinelloJson.tentativi,
        vincitore : indovinelloJson.vincitore,
        risposta: indovinelloJson.risposta,
     })
  } else {
    throw indovinelloJson; 
  }
}


  async function getAllIndovinelli() {
    // call: GET /api/indovinelli
    const response = await fetch(new URL('indovinelli', APIURL));
    const indovinelliJson = await response.json();
    if (response.ok) {
      return indovinelliJson.map((ind) => ({ id: ind.id, 
        domanda: ind.domanda, 
        durata: ind.durata,
         difficolta: ind.difficolta, 
         stato: ind.stato, 
         risposta: ind.risposta, //Il server restituisce risposta='' se l'indovinello è ancora aperto
         tentativi: ind.tentativi,//Il server restituisce tentativi = '' se l'indovinello è ancora aperto  
         vincitore:ind.vincitore,
         userId: ind.userId, 
         inizio:ind.inizio}));
    } else {
      throw indovinelliJson;  
    }
  }


  async function getSug1(indovinelloId) {
    const response = await fetch(new URL('primosug/' + indovinelloId, APIURL), {credentials: 'include'});
    const indovinelloJson = await response.json();
    if (response.ok) {
      return  ( indovinelloJson.primo_suggerimento )  
      } else {
      throw indovinelloJson;  
    }
  }


  async function getSug2(indovinelloId) {
    const response = await fetch(new URL('secondosug/' + indovinelloId, APIURL), {credentials: 'include'});
    const indovinelloJson = await response.json();
    if (response.ok) {
      return  ( indovinelloJson.secondo_suggerimento )  
    } else {
      throw response;  
    }
  }


  async function addRisposta(risposta, indovinello) {
    return new Promise((resolve, reject) => {
      fetch(new URL('risposta', APIURL), {
        method: 'POST',
        credentials: 'include',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
                               indovinelloId: indovinello.id, 
                               risposta: risposta,
                             }),
      }).then((response) => {
        if (response.ok) {
         response.json().then((result)=>{
          if(result.esito){
            resolve(true);
          }else{
            resolve(false)
          }
         }).catch(() => { reject({ error: "Cannot parse server response." }) })
        } else {
          response.json()
            .then((message) => { reject(message); }) 
            .catch(() => { reject({ error: "Cannot parse server response." }) }); 
        }
      }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); 
    });
  }

  async function addIndovinello(indovinello) {
    return new Promise((resolve, reject) => {
      fetch(new URL('indovinello', APIURL), {
        method: 'POST',
        credentials: 'include',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
                               id: indovinello.id, 
                               domanda: indovinello.domanda, 
                               difficolta: indovinello.difficolta,
                               stato : indovinello.stato,
                               durata: indovinello.durata,
                               risposta: indovinello.risposta,
                               primo_suggerimento: indovinello.primo_suggerimento,
                               secondo_suggerimento : indovinello.secondo_suggerimento,
                             }),
      }).then((response) => {
        if (response.ok) {
          resolve(response)
        } else {
          response.json()
            .then((message) => { reject(message); }) 
            .catch(() => { reject({ error: "Cannot parse server response." }) }); 
        }
      }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); 
    });
  }

  async function updateVincitore(nome, cognome, indovinelloId) {
    //si occupa anche di settare lo stato dell'indovinello a chiuso
    // PUT /api/newVincitore/:indovinelloId
    return new Promise((resolve, reject) => {
      const vincitore= `${nome} ${cognome}` ;
      fetch(new URL('newVincitore/' + indovinelloId, APIURL), {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ vincitore: vincitore }),
      }).then((response) => {
        if (response.ok) {
          resolve(null);
        } else {
          response.json()
            .then((obj) => { reject(obj); }) 
            .catch(() => { reject({ error: "Cannot parse server response." }) }); 
        }
      }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); 
    });
  }


  async function updateStatoChiuso(indovinelloId) {
    return new Promise((resolve, reject) => {
      fetch(new URL('newStatoChiuso/' + indovinelloId, APIURL), {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      }).then((response) => {
        if (response.ok) {
          resolve(null);
        } else {
          response.json()
            .then((obj) => { reject(obj); }) 
            .catch(() => { reject({ error: "Cannot parse server response." }) }); 
        }
      }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); 
    });
  }

  
  async function updateInizioConteggio(oraInizio, indovinelloId) {
    return new Promise((resolve, reject) => {
      fetch(new URL('updateInizio/' + indovinelloId, APIURL), {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ oraInizio: oraInizio }),
      }).then((response) => {
        if (response.ok) {
          resolve(null);
        } else {
       
          response.json()
            .then((obj) => { reject(obj); })
            .catch(() => { reject({ error: "Cannot parse server response." }) }); 
        }
      }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); 
    });
  }


  //API for login/authentication
  async function logIn(credentials) {
    let response = await fetch(new URL('sessions', APIURL), {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json', 
      },
      body: JSON.stringify(credentials),
    });
    if (response.ok) {
      const user = await response.json();
      return user;
    } else {
      const errDetail = await response.json();
      throw errDetail.message;
    }
  }

  async function logOut() {
    await fetch(new URL('sessions/current', APIURL), { method: 'DELETE', credentials: 'include' });
  }

  async function getUserInfo() {
    const response = await fetch(new URL('sessions/current', APIURL), {credentials: 'include'});
    const userInfo = await response.json();
    if (response.ok) {
      return userInfo;
    } else {
      throw userInfo; 
    }
  }

  async function getOrderedScores() {
    // call: GET /api/scoresOrdered
    const response = await fetch(new URL('scoresOrdered', APIURL));
    const utentiJson = await response.json();
    if (response.ok) {
      return utentiJson.map((u) => ({ id: u.id, nome: u.nome, cognome: u.cognome, score: u.score}));
    } else {
      throw utentiJson;  
    }
  }


  async function updateScore(toAdd, userId) {
    // PUT /api/newScore/:userId
    return new Promise((resolve, reject) => {
      fetch(new URL('newScore/' + userId, APIURL), {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ toAdd: toAdd }),
      }).then((response) => {
        if (response.ok) {
          resolve(null);
        } else {
       
          response.json()
            .then((obj) => { reject(obj); }) 
            .catch(() => { reject({ error: "Cannot parse server response." }) }); 
        }
      }).catch(() => { reject({ error: "Cannot communicate with the server." }) });
    });
  }


  const API = { addIndovinello, getAllIndovinelli, logIn, logOut, getUserInfo, getIndovinelloById,
              addRisposta, getRispostaById, updateScore, updateVincitore, getOrderedScores, updateInizioConteggio, 
              updateStatoChiuso, getIndovinelloRisposteById, getSug1, getSug2};
export default API;