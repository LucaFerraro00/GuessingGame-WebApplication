import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../App.css';
import { Button, Alert, Form,  Card,  Badge,  Container, Row, Col, Modal} from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Navigation } from './navbar';
import dayjs from 'dayjs';
import API from '../API'


function GuessForm(props) {

    const [risposta, setRisposta] = useState('');
    const [indovinello, setIndovinello] = useState('');
  
    const [counter, setCounter] = useState('');
  
    const [showSug1, setShowSug1] = useState(false);
    const [sug1, setSug1]=useState('');
    const [sug2, setSug2]=useState('');
    const [showSug2, setShowSug2] = useState(false);
  
    const [showModalWin, setShowModalWin] = useState(false);
    const [showModalLose, setShowModalLose] = useState(false);
    const [showModalEmpty, setShowModalEmpty] = useState(false);
    const [showModalChiuso, setShowModalChiuso] = useState(false);
  
    const [errorMsg, setErrorMsg] = useState('');
    const [dbError, setDbError] = useState('');

    const [flag, setFlag]=useState(false)
  
    const navigate = useNavigate();
    const indovinelloId = useParams().indovinelloId;
  
  
    const handleCloseLose = () => { navigate('/tuttiAperti') };
    const handleShowLose = () => {
      setShowModalLose(true);
    }
  
  
    const handleCloseChiuso = () => { navigate('/tuttiAperti') };
    const handleShowChiuso = () => {
      setShowModalChiuso(true);
    }
  
    const handleCloseEmpty = () => { navigate('/tuttiAperti') };
    const handleShowEmpty = () => {
      setShowModalEmpty(true);
      API.updateStatoChiuso(indovinelloId)
    };
  
    const handleCloseWin = () => { navigate('/tuttiAperti') };
    const handleShowWin = async () => {
      setShowModalWin(true);
      //UPDATE SCORE DELLO USER
      //UPDATE VINCITORE DELL'INDOVINELLO E CHIUSURA INDOVINELLO
      let toAdd = 0;
      switch (indovinello.difficolta) {
        case 'facile':
          toAdd = 1;
          break;
        case 'medio':
          toAdd = 2;
          break;
        case 'difficile':
          toAdd = 3;
          break;
        default:
          setDbError('ERRORE');
      }
      try {
        await API.updateScore(toAdd, props.user.id);
        await API.updateVincitore(props.user.name, props.user.surname, indovinello.id);
      } catch (err) {
        setDbError('errore server non disponibile');
      }
    };
  
  
    //blocco il timer di app quando entro, lo rifaccio partire quando riesco
    useEffect(() => {
      clearInterval(props.appInterval);
    }, []);

     //quando esco riattivo l'interval di APP2
     useEffect(()=>{
      return function cleanup() {
        if (flag) {
          props.setStartPolling(true);
        }
        setFlag(true)
      };
    },[flag])

    
    useEffect(() => {      
      API.getIndovinelloById(indovinelloId)
        .then((ind) => {
          setIndovinello(ind);
        })
        .catch(err => setDbError('errore dal server'))
    }, [])
  
    useEffect(() => {
      const id = setInterval(intervalf, 1000)
      return function cleanup() {
        clearInterval(id);
      };
    }, []);
  
    async function intervalf() {
      //ogni secondo controlla se qualcun altro ha iniziato il countdown.
      //Se il countdown è iniziato allora fa partire il conteggio.
      let updateCounter = false;
  
      let ind = await API.getIndovinelloById(indovinelloId)
      setIndovinello(ind);
      if (ind.inizio) { updateCounter = true; }
      if (ind.vincitore) {
        if (!showModalWin) {
          //l'utente che ha vinto non deve vedere modalClosed
          handleShowChiuso();
        }
      }
      //update del conteggio
      if (updateCounter) {
        let inizio = dayjs(ind.inizio);
        let fine = inizio.add(ind.durata, 'second');
        let diff = fine.diff(dayjs(), 'second');
        if (diff <= 0.5 * ind.durata) {
          let suggerimento1= await API.getSug1(indovinelloId);
          setSug1(suggerimento1)
          setShowSug1(true);
        }
        if (diff <= 0.25 * ind.durata) {
          let suggerimento2= await API.getSug2(indovinelloId);
          setSug2(suggerimento2)
          setShowSug2(true);
        }
        if (diff <= 0) {
          handleShowEmpty();
        }
        setCounter(diff)
      }
  
    }
  
    async function addRisposta(ris) {
      try {
        if (indovinello.inizio) {
          //non è la prima risposta. Non devo aggiornare la colonna 'inizio' della tabella indovinelli
          let result = await API.addRisposta(ris, indovinello);
          return result
        } else {
          //prima risposta aggiorno la colonna 'inizio' della tabella indovinelli
          const dataInizio = dayjs().format('YYYY-MM-DDTHH:mm:ss');
          await API.updateInizioConteggio(dataInizio, indovinello.id)
          let result = await API.addRisposta(ris, indovinello);
          return result
     }
      }
      catch (err) {
        setDbError('errore dal server');
      }
    }
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      if (!risposta) {
        setErrorMsg('inserire risposta!');
      } else {
        const giusta = await addRisposta(risposta);
        giusta ? handleShowWin() : handleShowLose()
      }
    }
  
  
    return (
      <>
        <Navigation logOut={props.logOut} loggedIn={props.loggedIn} user={props.user} />
        <Container>
          {dbError ? <Alert variant='danger' onClose={() => setDbError('')} dismissible>{dbError}</Alert> : false}
          <Row className='mt-3'>
            <Col >
              <h1>Prova a rispondere</h1>
            </Col>
          </Row>
          <Row>
            {indovinello.inizio && !showModalEmpty && !showModalLose && !showModalWin && !showModalChiuso ?
              <Alert variant='danger' >Rimangono  <Badge bg='secondary'>{counter}</Badge> secondi per rispondere</Alert> : false}
          </Row>
          <Row className='mt-5'>
            <Card>
              <Card.Header className='bg-warning'> <strong className='text-dark'>Domanda:</strong> <p className='text-dark'>{indovinello.domanda ? indovinello.domanda : ''} </p></Card.Header>
              <Card.Body>
                {errorMsg ? <Alert variant='danger' onClose={() => setErrorMsg('')} dismissible>{errorMsg}</Alert> : false}
                <Container>
                  {showSug1 ? (
                    <Row>
                      <p> <strong>Suggerimento 1: </strong>{sug1}</p>
                    </Row>
                  )
                    : ''}
                  {showSug2 ? (
                    <Row>
                      <p> <strong>Suggerimento 2: </strong> {sug2}</p>
                    </Row>
                  )
                    : ''}
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Form.Label> <strong>Risposta</strong> </Form.Label>
                      <Form.Control value={risposta} onChange={ev => setRisposta(ev.target.value)} as="textarea" placeholder="inserire la risposta dell'indovinello qui " />
                    </Row>
                    <Row className='mt-3' >
                      <Button type='submit' variant='info' >Invia risposta</Button>
                    </Row>
                  </Form>
                </Container>
              </Card.Body>
            </Card>
          </Row>
          <Row className='mt-4'>
            <Button variant='secondary' onClick={() => {
              navigate('/tuttiAperti')
            }}> Torna alla lista degli indovineli aperti </Button>
          </Row>
        </Container>
  
        {/*MODAL MOSTRATO QUANDO L'UTENTE VINCE (indovina la risposta)*/}
        <Modal show={showModalWin} onHide={handleCloseWin} size="lg">
          <Modal.Header closeButton className='bg-secondary'>
          </Modal.Header>
          <Modal.Body>
            <strong>Risposta inserita</strong>
            <p> {risposta} </p>
          </Modal.Body>
          <Modal.Footer className='bg-success'>
            <Modal.Body>
              <h2 className='text-light'>
                <strong>Risposta corretta </strong>
              </h2>
            </Modal.Body>
          </Modal.Footer>
        </Modal>
  
        {/*MODAL MOSTRATO QUANDO L'UTENTE INSERISCE UNA RISPOSTA SBAGLIATA*/}
        <Modal show={showModalLose} onHide={handleCloseLose} size="lg">
          <Modal.Header closeButton className='bg-secondary'>
          </Modal.Header>
          <Modal.Body>
            <strong>Risposta inserita</strong>
            <p> {risposta} </p>
          </Modal.Body>
          <Modal.Footer className='bg-danger'>
            <Modal.Body>
              <h2 className='text-light'>
                <strong>Risposta Errata </strong>
              </h2>
            </Modal.Body>
          </Modal.Footer>
        </Modal>
  
        {/*MODAL MOSTRATO QUANDO L'UTENTE NON INSERISCE RISPOSTA*/}
        {!showModalWin && !showModalLose && !showModalChiuso ? (<Modal show={showModalEmpty} onHide={handleCloseEmpty} size="lg">
          <Modal.Header closeButton className='bg-secondary'>
          </Modal.Header>
          <Modal.Body>
            <p><strong>TEMPO SCADUTO!</strong> Non hai inserito nessuna risposta </p>
          </Modal.Body>
          <Modal.Footer className='bg-warning'>
            <Modal.Body>
              <h2 className='text-light'>
                <strong>Risposta Non Inserita </strong>
              </h2>
            </Modal.Body>
          </Modal.Footer>
        </Modal>) : ''}
  
  
        {/*MODAL MOSTRATO QUANDO UN'ALTRO UTENTE RISPONDE PRIMA*/}
        {!showModalWin && !showModalLose ? (<Modal show={showModalChiuso} onHide={handleCloseChiuso} size="lg">
          <Modal.Header closeButton className='bg-secondary'>
          </Modal.Header>
          <Modal.Body>
            <p><strong>{indovinello.vincitore} è stato più veloce di te !</strong></p>
          </Modal.Body>
          <Modal.Footer className='bg-danger'>
            <Modal.Body>
              <h2 className='text-light'>
                <strong>Hai perso</strong>
              </h2>
            </Modal.Body>
          </Modal.Footer>
        </Modal>) : ''}
      </>
    )
  }


  export {GuessForm}