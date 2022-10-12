'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { check, validationResult } = require('express-validator');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');
const userDao = require('./userDao');
const indovinelliDao = require('./indovinelliDao');
const { use } = require('passport');


passport.use(new LocalStrategy(
  function (username, password, done) {
    userDao.getUser(username, password).then((user) => {
      if (!user)
        return done(null, false, { message: 'Username o password sbagliati' });
      return done(null, user);
    })
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  userDao.getUserById(id)
    .then(user => {
      done(null, user); 
    }).catch(err => {
      done(err, null);
    });
});


// init express
const app = express();
const port = 3001;

// set-up the middlewares
app.use(morgan('dev'));
app.use(express.json());
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};
app.use(cors(corsOptions)); 


const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated())
    return next();
  return res.status(401).json({ error: 'not authenticated' });
}

app.use(session({
  secret: 'a secret sentence not to share with anybody and anywhere, used to sign the session ID cookie',
  resave: false,
  saveUninitialized: false
}));

//init passport
app.use(passport.initialize());
app.use(passport.session());


//Crea e aggiunge un nuovo indovinello al db nella tabella 'indovinelli'
app.post('/api/indovinello', isLoggedIn, [
  check('domanda').isString(),
  check('difficolta').isString(),
  check('durata').isInt({ min: 30, max: 600 }),
  check('risposta').isString(),
  check('primo_suggerimento').isString(),
  check('secondo_suggerimento').isString(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const indovinello = {
    domanda: req.body.domanda,
    difficolta: req.body.difficolta,
    stato: req.body.stato,
    durata: req.body.durata,
    risposta: req.body.risposta,
    primo_suggerimento: req.body.primo_suggerimento,
    secondo_suggerimento: req.body.secondo_suggerimento,
  };
  try {
    await indovinelliDao.createIndovinello(indovinello, req.user.id);
    res.status(201).end();
  } catch (err) {
    console.log(err);
    res.status(503).json({ error: `Database error during the creation of id ${indovinello.id}.` });
  }
});

//Crea e aggiunge una nuova risposta al db (nella tabella risposte)
app.post('/api/risposta', isLoggedIn, async (req, res) => {
  try {
    let result = await indovinelliDao.getRispostaCorrettaById(req.body.indovinelloId);
    console.log(result)
    let rispostaCorretta = result.rispostaCorretta;
    console.log(result)
    await indovinelliDao.addRisposta(req.user.id, req.body.indovinelloId, req.body.risposta);
    let esito = 0
    if (rispostaCorretta === req.body.risposta){
      esito =1
    } else{esito =0}
    console.log(esito)
     result.esito=esito;
     res.json(result);
    } catch (err) {
    console.log(err);
    res.status(503).json({ error: `Database error during the creation of risposta}.` });
  }
});

//Aggiunge all'indovinelloId il nome dell'utente che ha risposto correttamente
app.put('/api/newVincitore/:indovinelloId', isLoggedIn, [
  check('vincitore').isString(),
  check('indovinelloId').isInt(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const vincitore = req.body.vincitore;

  try {
    await indovinelliDao.updateVincitore(vincitore, req.params.indovinelloId);
    res.status(200).end();
  } catch (err) {
    console.log(err);
    res.status(503).json({ error: `Database error during the update of indovinello.` });
  }

});

//Aggiunge all'indovinelloId il timestamp in cui è stata inviata la prima risposta
app.put('/api/updateInizio/:indovinelloId', isLoggedIn, [
  check('indovinelloId').isInt(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const oraInizio = req.body.oraInizio;

  try {
    await indovinelliDao.updateOraInizio(oraInizio, req.params.indovinelloId);
    res.status(200).end();
  } catch (err) {
    console.log(err);
    res.status(503).json({ error: `Database error during the update of indovinello.` });
  }
});

//Aggiorna lo stato dell'indovinello
app.put('/api/newStatoChiuso/:indovinelloId', isLoggedIn, [
  check('indovinelloId').isInt(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    await indovinelliDao.updateStatoChiuso(req.params.indovinelloId);
    res.status(200).end();
  } catch (err) {
    console.log(err);
    res.status(503).json({ error: `Database error during the update of indovinello.` });
  }

});

//restituisce tutti gli indovinelli di tutti gli utenti
app.get('/api/indovinelli', async (req, res) => {
  try {
    let indovinelli = await indovinelliDao.allIndovinelli();
    if (indovinelli.error)
      res.status(404).json(indovinelli);
    else
      indovinelli = await Promise.all(indovinelli.map(async (i) => {
        let tentativi = await indovinelliDao.getRisposteByIndovinelloId(i.id);
        let a = []
        tentativi.map((r) => (a.push(`-${r.risposta}`)));
        i.tentativi = a;
        return i;
      }))
    res.json(indovinelli);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: `Database error while retrieving indovinelli.` }).end();
  }
});

//restituisce l'indovinello 
app.get('/api/indovinello/:id', isLoggedIn, async (req, res) => {
  try {
    const result = await indovinelliDao.indovinelloById(req.params.id, req.user.id);
    if (result.error)
      res.status(404).json(result);
    else
      res.json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: `Database error while retrieving indovinello ${req.params.id}.` }).end();
  }
});

//restituisce le risposte relative all'indovinello con id richiesto
app.get('/api/indovinelloRisposte/:id', async (req, res) => {
  try {
    let result = await indovinelliDao.indovinelloById(req.params.id);
    let partialAnswer = await indovinelliDao.getRispostaCorrettaById(req.params.id);
    let rispostaCorretta = partialAnswer.rispostaCorretta;
    const risposteProvate = await indovinelliDao.getRisposteByIndovinelloId(req.params.id);
    let a = []
    risposteProvate.map((r) => (a.push(`-${r.risposta}`)));
    result.tentativi = a;
    result.risposta = rispostaCorretta;
    res.json(result);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: `Database error while retrieving indovinello ${req.params.id}.` }).end();
  }
});

//controllo se l'utente ha già risposto all'indovinello
app.get('/api/risposta/:indovinelloId', isLoggedIn, async (req, res) => {
  try {
    const result = await indovinelliDao.getRispostaById(req.params.indovinelloId, req.user.id);
    if (result != undefined) { res.status(306).json({ error: "Hai già risposto all'indovinello" }).end() }
    //non uso codice 400 per non farlo apparire nella console
    else {
      res.json(result);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: `Database error while retrieving risposta.` }).end();
  }
});


app.get('/api/primosug/:indovinelloId', isLoggedIn, async (req, res) => {
  try {
    const result = await indovinelliDao.getPrimoSugById(req.params.indovinelloId);
    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: `Database error while retrieving risposta.` }).end();
  }
});


app.get('/api/secondosug/:indovinelloId', isLoggedIn, async (req, res) => {
  try {
    const result = await indovinelliDao.getSecondoSugById(req.params.indovinelloId);
    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: `Database error while retrieving risposta.` }).end();
  }
});


//aggiorna il punteggio dell'utente
app.put('/api/newScore/:userId', isLoggedIn, [
  check('toAdd').isInt({ min: 0 }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const toAdd = req.body.toAdd;

  try {
    let user = await userDao.getUserById(req.user.id);
    const newScore = user.score + toAdd;
    await userDao.updateScore(newScore, req.user.id);
    res.status(200).end();
  } catch (err) {
    console.log(err);
    res.status(503).json({ error: `Database error during the update of user.` });
  }

});

//ritorna la lista ordinata degli utenti in classifica
app.get('/api/scoresOrdered', async (req, res) => {
  try {
    //1)prendo il terzo o secondo o primo (se tutti pari) punteggio
    //2)Prendo tutti gli utenti che hanno punteggio >= al terzo e li ritorno ordinati in ordine di punteggio
    //decrescente
    const topScores = await userDao.getTopScores();
    const target = topScores[topScores.length - 1].score;
    //target rappresenta l'ultimo score che va selezionato
    const result = await userDao.getTopUsers(target);
    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: `Database error while retrieving users.` }).end();
  }
});


app.post('/api/sessions', function (req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
    if (!user) {
      // display wrong login messages
      return res.status(401).json(info);
    }
    // success, perform the login
    req.login(user, (err) => {
      if (err)
        return next(err);
      // req.user contains the authenticated user, we send all the user info back
      // this is coming from userDao.getUser()
      return res.json(req.user);
    });
  })(req, res, next);
});


app.get('/api/sessions/current', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  }
  else
    res.status(401).json({ error: 'Unauthenticated user!' });;
});


app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => { res.end(); });
});


// aattiva il server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});






