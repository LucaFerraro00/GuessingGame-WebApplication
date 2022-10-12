# Requirements


Progettare e implementare un’applicazione web per gestire una piattaforma di gioco che si basa sul
pubblicare e risolvere indovinelli.
Nota: nel seguito, “utente” significa un qualsiasi utente che sia autenticato (quindi logged-in), mentre
visitatore anonimo è un utente che non è logged-in.
Ogni utente dell’applicazione può pubblicare uno o più indovinelli, che gli altri utenti possono provare a
risolvere.
Un indovinello è caratterizzato da una domanda (una stringa di testo), un livello di difficoltà (facile, medio,
difficile), una durata (un numero intero di secondi, da 30 a 600), la risposta corretta (una stringa di testo),
e 2 suggerimenti (stringhe di testo). Un indovinello può essere pubblicato da un qualsiasi utente, e tutti
gli altri utenti possono provare a rispondere, nella durata prevista. La durata è misurata a partire dalla
prima risposta inviata (non dal momento di pubblicazione dell’indovinello). Il primo utente che fornisce la
risposta corretta ottiene un punteggio, l’indovinello diventa “chiuso”, e non possono essere date ulteriori
risposte. Se nessun utente fornisce le risposte corrette all’interno della durata prevista l’indovinello
diventa automaticamente “chiuso”.
In particolare, il sistema deve supportare le seguenti funzionalità:
- Un utente può creare un nuovo indovinello, fornendo tutte le necessarie informazioni. Un
indovinello nuovo è creato in stato “aperto”, ossia che consente di inviare risposte.
- Un utente può vedere lo stato di ognuno dei suoi indovinelli che ha pubblicato come autore: Se l’indovinello è “chiuso”, l’autore vedrà tutte le risposte che sono state date, la risposta corretta decisa dall’autore dell’indovinello, e l’indicazione del vincitore se presente; Se l’indovinello è “aperto”, l’autore vedrà tutte le risposte correnti (aggiornate ogni
secondo), e un conto alla rovescia (count-down) che mostra il tempo rimanente.
- Qualsiasi utente può vedere la lista degli indovinelli, divisi tra “aperti” e “chiusi”, vedendo la
domanda ed il suo livello di difficoltà: Selezionando un indovinello “chiuso” verranno mostrate tutte le risposte che sono state
date, la risposta corretta decisa dall’autore dell’indovinello, e l’indicazione del vincitore
se presente; Selezionando un indovinello “aperto” si avrà l’opportunità di rispondere (ovviamente
senza che siano mostrate le altre risposte). Ogni utente può fornire al massimo una sola
risposta per ogni indovinello. Mentre fornisce la risposta verrà mostrato un conto alla
rovescia (count-down) che mostra il tempo rimanente. Se il tempo rimanente è minore
del 50%, il primo suggerimento viene mostrato. Se il tempo rimanente è minore del 25%,
anche il secondo suggerimento viene mostrato. Se la risposta è corretta, l’indovinello
diventa immediatamente “chiuso” e l’utente otterrà un punteggio pari a 3, 2 o 1 punti,
secondo la difficoltà dell’indovinello (rispettivamente difficile, medio, facile).
- I visitatori anonimi vedranno la lista degli indovinelli (domanda e difficoltà) ma non vedranno né
le risposte date né la risposta corretta.
- I visitatori anonimi e gli utenti possono vedere la classifica dei migliori 3 punteggi ottenuti (“top-
3”). Nel caso di pari merito, devono essere mostrati tutti gli utenti che hanno i 3 punteggi più alti.
L’organizzazione di queste funzionalità in differenti schermate (e potenzialmente in differenti routes) è
lasciata allo studente ed è oggetto di valutazione.
## Requisiti del progetto
- L’architettura dell’applicazione e il codice sorgente devono essere sviluppati adottando le migliori
pratiche (best practice) di sviluppo del software, in particolare per le single-page application (SPA)
che usano React e HTTP API.
- Il progetto deve essere realizzato come applicazione React, che interagisce con un’API HTTP
implementata in Node+Express. Il database deve essere memorizzato in un file SQLite.
- La comunicazione tra il client ed il server deve seguire il pattern “two servers”, configurando
correttamente CORS, e React deve girare in modalità “development”.
- La directory radice del progetto deve contenere un file README.md e contenere due
subdirectories (client e server). Il progetto deve poter essere lanciato con i comandi: “cd
server; nodemon index.js” e “cd client; npm start”. Viene fornito uno scheletro
delle directory del progetto. Si può assumere che nodemon sia già installato a livello di sistema.
- L’intero progetto deve essere consegnato tramite GitHub, nel repository creato da GitHub
Classroom.
- Il progetto non deve includere le directory node_modules. Esse devono essere ricreabili tramite
il comando “npm install”, subito dopo “git clone”.
- Il progetto può usare librerie popolari e comunemente adottate (come per esempio day.js,
react-bootstrap, ecc.), se applicabili e utili. Tali librerie devono essere correttamente
dichiarate nei file package.json e package-lock.json cosicché il comando npm install
le possa scaricare ed installare tutte.
- L’autenticazione dell’utente (login) e l’accesso alle API devono essere realizzati tramite
passport.js e cookie di sessione, utilizzando il meccanismo visto a lezione. Non è richiesto
alcun ulteriore meccanismo di protezione. La registrazione di un nuovo utente non è richiesta.
## Requisiti del database
- Il database del progetto deve essere implementato a cura dello studente, e deve essere
precaricato con almeno 5 utenti, di cui almeno 3 nel top-3. Tutti gli utenti devono avere almeno
due indovinelli chiusi ed uno aperto.



## React Client Application Routes

- Route `/`: contiene la pagina principale se l'utente ha fatto il login (tabella degli indovinelli dell'utente, classifica), se l'utente è anonimo viene reindirizzato sulla pagina per fare il login
- Route `/anonymous`: contiene le informazioni disponibili (tabella indovinelli e classifica utenti) per l'utente anonimo (che non ha fatto il login)
- Route `/add`: contiene il form per aggiungere un nuovo indovinello
- Route `/login`: contiene il form per fare il login
- Route `/tuttiChiusi`: mostra la lista di tutti gli indovinelli chiusi
- Route `/tuttiAperti`: mostra la lista di tutti gli indovinelli aperti, selezionandone uno si può rispondere
- Route `/guess/:indovinelloId`: contiene il form che consente all'utente di provare a rispondere all'indovinello selezionato (che ha id=:indovinelloId) 
- Route `/aperto/:indovinelloId`: mostra le informazioni dell'indovinello aperto selezionato dalla pagina principale dell'utente 
- Route `/chiuso/:indovinelloId`: mostra le informazioni dell'indovinello chiuso selezionato dalla pagina principale dell'utente 

## API Server

- POST `/api/login`
  - request parameters and request body content
  - response body content
- GET `/api/something`
  - request parameters
  - response body content
- POST `/api/indovinello`
  - nel request body vengono messe le informazioni del nuovo indovinello creato e aggiunto nella tabella indovinelli
  - restituisce un valore logico che indica se la risposta inserita è corretta o no
- POST `/api/risposta`
  - nel request body vengono messe le informazioni della nuova risposta creata e aggiunta nella tabella risposte
- PUT `/api/newVincitore/:indovinelloId`
  - nel request body viene messo il nome dell'utente che ha risposto correttamente all'indovinello identificato dal parametro indovinelloId. Aggiorna la colonna 'vincitore' della tabella indovinelli sul db
- PUT `/api/updateInizio/:indovinelloId`
  - nel request body viene messo il timestamp relativo all'istante in cui un utente invia la prima risposta all'indovinello individuato dal parametro indovinelloid. Agiorna la colonna 'inizio' della tabella indovinelli sul db
- PUT `/api/newStatoChiuso/:indovinelloId`
  - imposta lo stato a 'chiuso' per l'indovinello identificato dal parametro indovinelloId
- GET `/api/indovinelli`
  - restituisce la lista di tutti gli indovinelli, restituisce risposta corretta e suggerimenti solo se l'indovinello è già chiuso
- GET `/api/indovinello/:id`
  - il parametro id è l'identificativo dell'indovinello
  - restituisce le informazioni dell'indovinello
- GET `/api/indovinelloRisposte/:id`
  - il parametro id è l'identificativo dell'indovinello
  - restituisce le risposte associate all'indovinello
- GET `/api/risposta/:indovinelloId`
  - il parametro id è l'identificativo dell'indovinello
  - restituisce un errore se la tabella risposte contiene già una risposta associata all'utente che fa la richiesta e al parametro indovinelloId
- PUT `/api/newScore/:userId`
  - Aggiorna il punteggio dell'utente, identificato da userId. Il nuovo punteggio è inviato nel request body
- GET `api/scoresOrdered`
  - ritorna la lista ordinata degli utenti in classifica  
- GET `/api/sessions/current`
  - ritorna un errore se l'utente non è autenticato
- POST `/api/sessions`
  - nel request body vengono messe le credenziali dell'utente che tenta di fare il login
  - vengono ritornate le informazioni dell'utente se il login ha successo


## Database Tables

- Table `utenti` - contiene le informazioni relative agli utenti: credenziali, punteggio
- Table `risposte` - contiene una riga per ogni risposta provata dagli utenti, viene salvato l'id dell'indovinello e dell'utente che ha risposto
- Table `indovinelli` - contiene tutte le informazioni dell'indovinello compreso l'identificatore dell'utente che l'ha creato


## Main React Components

- `Navigation` (in `navbar.js`): barra di navigazione, mostrata in tutte le pagine tranne `/login`. Contiene bottoni e link per muoversi all'interno dell'applicazione
- `MainPageUser` (in `UserComponents.js`): crea le tabelle che devono essere mostrate sulla pagina principale dell'utente (tabella degli indovinelli, classifica utenti)
- `ApertoDettagli` (in `UserComponents.js`): mostra le informazioni relative all'indovinello aperto dell'utente aggiornate in "tempo reale"
- `ChiusoDettagli` (in `UserComponents.js`): mostra le informazioni relative all'indovinello chiuso dell'utente 
- `AddIndovinelloForm` (in `NewIndovinelloForm.js`): contiene e gestisce il form per aggiungere un nuovo indovinello
- `ListaAperti` (in `TuttiIndovinelli.js`): mostra le informazioni relative e tutti gli indovinelli aperti di tutti gli utenti, selezionando un indovinello l'utente può rispondere  
- `ListaChiusi` (in `TuttiIndovinelli.js`): mostra le informazioni relative e tutti gli indovinelli chiusi di tutti gli utenti, selezionando un indovinello apre un Modal che mostra i dettagli dell'indovinello selezionato
- `GuessForm` (in `GuessForm.js`): contiene e gestisce il form per rispondere ad un indovinello, controlla e aggiorna il countdown, mostra e definisce oppurtanamente un "Modal" a seconda che la risposta inserita sia giusta o sbagliata
- `MainPageAnonimo` (in `homeAnonimo.js`): crea le tabelle contenti le informazioni che devono essere mostrate ad un utente anonimo
- `LoginForm` (in `LoginComponents.js`): contiene e gestisce il form per inserire le credenziali ed effettuare il login

## Screenshot

![Screenshot](./img/screen.jpg)

## Users Credentials

- sandro.tonali@gmail.com -> password= sandropassword
- matteo.berrettini@gmail.com -> password= matteopassword
- brad.pitt@gmail.com -> password = bradpassword
- federica.pellegrini@gmail.com -> password = federicapassword
- mario.draghi@gmail.com -> password = mariopassword
