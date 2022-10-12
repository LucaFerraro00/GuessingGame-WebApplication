import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../App.css';

import { Button, Alert, OverlayTrigger, Tooltip, Spinner, Card, Dropdown } from 'react-bootstrap';
import { Container, Row, Col, Table } from 'react-bootstrap';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Navigation } from './navbar';
import dayjs from 'dayjs';
import { useState } from 'react';
import { ClassificaRow } from './homeAnonimo'
import API from '../API'


function MainPageUser(props) {


  const [topUsers, setTopUsers] = useState([]);
  const [errors, setErrors] = useState('')

  //cre la classifica
  useEffect(() => {
    const loadUsers = async () => {
      try {
        let users = await API.getOrderedScores();
        setTopUsers(users);
        props.setInitialLoading(false);
        //props.setStartPolling(true);
      } catch (err) {
        setErrors('server non disponibile')
      }
    }
    loadUsers()
  }, [])



  const navigate = useNavigate();

  return (
    <>
      <Navigation logOut={props.logOut} loggedIn={props.loggedIn} user={props.user} />
      {props.initialLoading ? <Loading /> : (
        <>
          {errors ? <Alert variant='danger' onClose={() => setErrors('')} dismissible>{errors}</Alert> : false}
          {props.message ? <Alert variant='danger' onClose={() => props.setMessage('')} dismissible>{props.message}</Alert> : false}
          <Container className='mt-3'>
            <Row>
              <Alert variant='info'>
                <Container>
                  <Row>
                    <strong className='text-dark text-center'> Ciao {props.user.name}, stai visualizzando solo i tuoi indovinelli ! </strong>
                    </Row>
                    <Row  className="justify-content-md-center">
                      <Col md='auto'>
                    <Dropdown className='mt-3'>
                      <Dropdown.Toggle variant="dark" id="dropdown-basic">
                        Voglio visualizzare tutti gli indovinelli
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => navigate('/tuttiAperti')}>Ancora aperti</Dropdown.Item>
                        <Dropdown.Item onClick={() => navigate('/tuttiAperti')}>Già chiusi</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                    </Col>
                    </Row>
                </Container>
              </Alert>
            </Row>

            <Card className='border border-info'>
              <Container>
                <Row className='mt-4'>
                  <Col>
                    <Row>
                      <h2 className='text-center'>I miei indovinelli chiusi</h2>
                    </Row>
                    <Table bordered hover className='border border-dark'>
                      {/*Tabella per gli indovinelli chiusi*/}
                      <thead>
                        <tr>
                          <th>Domanda</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          props.myIndovinelliChiusi.map((ind) => {
                            return (
                              <IndovinelloChiusoRow ind={ind} key={ind.id} />
                            )
                          })
                        }
                      </tbody>
                    </Table>
                  </Col>

                  <Col>
                    <Row>
                      <h2 className='text-center'>I miei indovinelli aperti</h2>
                    </Row>
                    {/*Tabella per gli indovinelli aperti*/}
                    <Table bordered hover className='border border-dark'>
                      <thead>
                        <tr>
                          <th>Domanda</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          props.myIndovinelliAperti.map((ind) => <IndovinelloApertoRow ind={ind} key={ind.id} />)
                        }
                      </tbody>
                    </Table>

                  </Col>
                </Row>
                <Row className="justify-content-md-center mb-3">
                  <Col md='auto'>
                    <Button variant='info' onClick={() => navigate('/add')}> aggiungi indovinello</Button>
                  </Col>
                </Row>
              </Container>
            </Card>

            <Card className='mt-5 border border-info mb-5'>
              <Container>
                <Row className='mt-3'>
                  <h2 className='text-center'>Classifica Utenti</h2>
                </Row>
                <Row className='mt-3 justify-content-md-center' >
                  <Col md="auto">
                  <Table bordered className='border border-dark' >
                    {/*Tabella per gli indovinelli chiusi*/}
                    <thead>
                      <tr>
                        <th>Utente</th>
                        <th>Punteggio</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        topUsers.map((u) => <ClassificaRow user={u} key={u.id} />)
                      }
                    </tbody>
                  </Table>
                  </Col>
                </Row>
              </Container>
            </Card>


          </Container>
        </>
      )}
    </>
  )
}

function IndovinelloChiusoRow(props) {

  const navigate = useNavigate();

  const placement = 'top'
  return (
    <>
      <OverlayTrigger
        placement={placement}
        overlay={
          <Tooltip id={`toolt`}>
            <strong>Click per le informazioni sull'indovinello</strong>.
          </Tooltip>
        }>
        <tr onClick={() => navigate(`/chiuso/${props.ind.id}`)} className='over-row'>
          <td>
            {props.ind.domanda}
          </td>
          <td>
            <i className="bi bi-info-circle icon-size" ></i>
          </td>
        </tr>
      </OverlayTrigger>
    </>
  )
}

function IndovinelloApertoRow(props) {

  const navigate = useNavigate();

  const placement = 'top'
  return (
    <>
      <OverlayTrigger
        placement={placement}
        overlay={
          <Tooltip id={`tooltip-${placement}`}>
            <strong>Click per le informazioni sull'indovinello</strong>.
          </Tooltip>
        }>
        <tr onClick={() => navigate(`/aperto/${props.ind.id}`)} className='over-row'>
          <td>
            {props.ind.domanda}
          </td>
          <td>
            <i className="bi bi-info-circle icon-size"></i>
          </td>
        </tr>
      </OverlayTrigger>
    </>
  )
}


function ApertoDettagli(props) {

  const [indovinello, setIndovinello] = useState('');
  const [counter, setCounter] = useState('');
  const [partito, setPartito] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true);
  const [errors, setErrors] = useState('');
  const [flag, setFlag]= useState(false)

  const [chiusoTempoReale, setChiusoTempoReale] = useState(false);


  const indovinelloId = useParams().indovinelloId;
  const navigate = useNavigate();


  //stoppo il timer di app e poi lo faccio ripartire quando esco
  useEffect(() => {
    clearInterval(props.appInterval);
    
  }, []);

  useEffect(()=>{
    return function cleanup() {
      if (flag) {
        //if messo per evitare di eseguire questo quando viene creato il componente
        props.setStartPolling(true);
      }
      setFlag(true)
    };
  },[flag])


  useEffect(() => {
    const intId = setInterval(intervalf, 1000)
    return function cleanup() {
      clearInterval(intId);
    };
  }, [])


  async function intervalf() {
    API.getIndovinelloRisposteById(indovinelloId).then(
      ind => {
        setIndovinello(ind);
        setInitialLoading(false);
        if (ind.inizio) {
          setPartito(true)
          if (ind.stato === 'chiuso') {
            setChiusoTempoReale(true);
            setCounter(0);
            return ('')
          }
          let inizio = dayjs(ind.inizio);
          let fine = inizio.add(ind.durata, 'second');
          let diff = fine.diff(dayjs(), 'second');
          if (diff >= 0) { setCounter(diff) }

        }
      }
    ).catch(err => setErrors('server non disponibile'))
  }


  return (
    <>
      <Navigation logOut={props.logOut} loggedIn={props.loggedIn} user={props.user} />
      {initialLoading ? <Loading /> : (
        <>
          {errors ? <Alert variant='danger' onClose={() => setErrors('')} dismissible>{errors}</Alert> : false}
          {chiusoTempoReale ? <Alert variant='danger'>L'indovinello è stato appena chiuso</Alert> : false}
          <Container>
            <Row className='mt-3'>
              <h1>
                Dettagli dell'indovinello aperto
              </h1>
            </Row>
            <Card className='mt-4'>
              <Container>
                <Row className='mt-5'>
                  <h2> <strong className='text-info'> Domanda: </strong> {indovinello.domanda}</h2>
                </Row>
                <Row className='mt-5'>
                  <h2> <strong className='text-info'> Risposte provate: </strong> </h2>
                  {indovinello.tentativi ? (indovinello.tentativi.map(r => <Row key={r}> <h2>{r}</h2> </Row>))
                    : ('Ancora nessuna risposta è stata tentata')}
                </Row>
                <Row className='mt-5'>
                  <h2> <strong className='text-info'> Tempo rimasto: </strong> </h2>
                  {partito ? (
                    <h2>{counter}</h2>
                  )
                    : (<h2>Il countdown non è ancora partito</h2>)
                  }
                </Row>
              </Container>
            </Card>
            <Row >
              <Button className='mt-4' variant='secondary' onClick={() => { navigate('/') }}> Ritorna alla lista dei miei indovinelii </Button>
            </Row>
          </Container>
        </>)}

    </>
  )

}


function ChiusoDettagli(props) {

  const [indovinello, setIndovinello] = useState('');
  const [errors, setErrors] = useState('');
  const [flag, setFlag]=useState(false);

  const indovinelloId = useParams().indovinelloId;
  const navigate = useNavigate();


  useEffect(() => {
    API.getIndovinelloRisposteById(indovinelloId).then(
      ind => {
        setIndovinello(ind);
      }
    ).catch(err => setErrors('Errore: server non disponibile'))
  }, [])

 
  useEffect(() => {
    clearInterval(props.appInterval);
  }, []);

  useEffect(()=>{
    return function cleanup() {
      if (flag) {
        props.setStartPolling(true);
      }
      setFlag(true)
    };
  },[flag])


  return (
    <>
      <Navigation logOut={props.logOut} loggedIn={props.loggedIn} user={props.user} />
      {errors ? <Alert variant='danger' onClose={() => setErrors('')} dismissible>{errors}</Alert> : false}
      <Container>
        <Row className='mt-3'>
          <h1>
            Dettagli dell'indovinello chiuso
          </h1>
        </Row>
        <Card className='mt-4'>
          <Container>
            <Row className='mt-5'>
              <h2> <strong className='text-info'> Domanda: </strong> {indovinello.domanda}</h2>
            </Row>
            <Row className='mt-5'>
              <h2> <strong className='text-info'> Risposte provate: </strong> </h2>
              {indovinello.tentativi ? (indovinello.tentativi.map(r => <Row key={r}> <h2>{r}</h2> </Row>))
                : ('Ancora nessuna risposta è stata tentata')}
            </Row>
            <Row className='mt-5'>
            </Row>
            <Row className='mt-5'>
              <h2> <strong className='text-info'> Risposta corretta: </strong> {indovinello.risposta}</h2>
            </Row>
            <Row className='mt-5'>
              <h2> <strong className='text-info'> Vincitore: </strong> {indovinello.vincitore}</h2>
            </Row>
          </Container>
        </Card>
        <Row >
          <Button className='mt-4' variant='secondary' onClick={() => { navigate('/') }}> Ritorna alla lista dei miei indovinelii </Button>
        </Row>
      </Container>
    </>
  )

}





function Loading(props) {
  return (
    <Container>
      <Row className="justify-content-md-center pt-4">
        <Col md='auto' >
          <h2 className='text-danger'> Loading data</h2>
        </Col>
      </Row>
      <Row className="justify-content-md-center pt-4">
        <Col md='auto' >
          <Spinner animation="border" role="status" variant="warning" />
        </Col>
      </Row>
    </Container>
  )
}

export { MainPageUser, Loading, ApertoDettagli, ChiusoDettagli };
