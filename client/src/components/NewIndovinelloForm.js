import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../App.css';

import { Button, Alert, Form  } from 'react-bootstrap';
import { Container, Row, Col } from 'react-bootstrap';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from './navbar';
import { useState } from 'react';
import API from '../API'


function AddIndovinelloForm(props) {

    const [domanda, setDomanda] = useState('');
    const [durata, setDurata] = useState(0);
    const [difficolta, setDifficolta] = useState('facile');
    const [risposta, setRisposta] = useState('');
    const [primoSug, setPrimoSug] = useState('');
    const [secondoSug, setSecondoSug] = useState('');
  
    const [errorMsg, setErrorMsg] = useState('');
    const [dbError, setDbError] = useState('');
    const [flag, setFlag]=useState(false)
  
    const navigate = useNavigate();
  
    //quando entro blocco l'interval di APP2
    useEffect(() => {
      clearInterval(props.appInterval);
    }, []);

    //quando esco riattivo l'interval di APP2
    useEffect(()=>{
      return function cleanup() {
        if (flag) {
          props.setStartPolling(true);
          props.setInitialLoading(true)
        }
        setFlag(true)
      };
    },[flag])
  
    function addIndovinello(indovinello) {
      indovinello.stato = 'aperto';
      props.setIndovinelli(oldIndovinelli => [...oldIndovinelli, indovinello]);
      API.addIndovinello(indovinello)
        .then(() => { })
        .catch(err => handleError());
    }
  
    function handleError() {
      setDbError('errore: server fuori uso')
    }
  
  
    const handleSubmit = (event) => {
      event.preventDefault();
  
      let isValid = true;
      const errorMessages = [];
  
  
      //Se il titolo è vuoto
      if (domanda.trim() === '') {
        isValid = false;
        errorMessages.push("Inserisci domanda");
      }
  
      if (risposta.trim() === "") {
        isValid = false;
        errorMessages.push("Inserisci risposta");
      }
  
      if (durata < 30 || durata > 600) {
        isValid = false;
        errorMessages.push("Durata non valida");
      }
  
      if (primoSug.trim() === "") {
        isValid = false;
        errorMessages.push("Inserisci suggerimento1");
      }
  
      if (secondoSug.trim() === "") {
        isValid = false;
        errorMessages.push("Inserisci suggerimento2");
      }
  
      if (isValid) {
        const newIndovinello = { domanda: domanda, difficolta: difficolta, durata: durata, risposta: risposta, primo_suggerimento: primoSug, secondo_suggerimento: secondoSug }
        addIndovinello(newIndovinello);
        navigate('/');
      }
  
      else {
        setErrorMsg(errorMessages.join(" | "));
      }
  
    }
  
  
    return (
      <>
        <Navigation logOut={props.logOut} loggedIn={props.loggedIn} user={props.user} />
        {dbError ? <Alert variant='danger' onClose={() => setDbError('')} dismissible>{dbError}</Alert> : false}
        <Container className='mb-5'>
          <Row className='mt-3'>
            <Col >
              <h1 className='text-info text-center'>Aggiungi un indovinello</h1>
            </Col>
          </Row>
          <Row>
            <Col>
              {errorMsg ? <Alert variant='danger' onClose={() => setErrorMsg('')} dismissible>{errorMsg}</Alert> : false}
              <Form onSubmit={handleSubmit} className='border border-info'>
                <Container>
                <Form.Group className='mt-3'>
                  <Form.Label> <h3>Domanda</h3> </Form.Label>
                  <Form.Control value={domanda} onChange={ev => setDomanda(ev.target.value)} as="textarea" placeholder="inserire la domanda dell'indovinello qui " />
                </Form.Group>
                <Form.Group className='mt-3'>
                  <Form.Label> <h3>Durata</h3></Form.Label>
                  <Form.Control type='number' min={30} max={600} value={durata} onChange={ev => setDurata(ev.target.value)} />
                </Form.Group>
                <Form.Group className='mt-3'>
                  <Form.Label> <h3>Difficolta</h3></Form.Label>
                  <Form.Select aria-label="Default select example" value={difficolta} onChange={ev => setDifficolta(ev.target.value)}>
                    <option value="facile">Facile</option>
                    <option value="medio">Medio</option>
                    <option value="difficile">Difficile</option>
                  </Form.Select>
                </Form.Group >
                <Form.Label className='mt-3'> <h3>Risposta</h3> </Form.Label>
                <Form.Control value={risposta} onChange={ev => setRisposta(ev.target.value)} as="textarea" placeholder="inserire la risposta dell'indovinello qui " />
                <Form.Label className='mt-3'> <h3>Suggerimento 1</h3> </Form.Label>
                <Form.Control value={primoSug} onChange={ev => setPrimoSug(ev.target.value)} as="textarea" placeholder="inserire il primo suggerimento dell'indovinello qui " />
                <Form.Label className='mt-3'> <h3>Suggerimento 2</h3> </Form.Label>
                <Form.Control value={secondoSug} onChange={ev => setSecondoSug(ev.target.value)} as="textarea" placeholder="inserire il seconndo suggerimento dell'indovinello qui " />
  
                <Row className='mb-3'>
                  <Button type='submit' variant='info' className='mt-3'>Salva </Button>
                </Row>
                </Container>
              </Form>
            </Col>
          </Row>
          <Row>
          <Button onClick={() => navigate('/')} variant='secondary' className='mt-3' >Torna indietro alla pagina principale</Button>
          </Row>
        </Container>
      </>
    )
  
  }


  export {AddIndovinelloForm}