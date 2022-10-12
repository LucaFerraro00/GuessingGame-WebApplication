import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../App.css';
import { Loading } from './UserComponents';
import { Alert, Table, OverlayTrigger,Tooltip, Container, Row, Col, Modal  } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Navigation } from './navbar';
import { useState } from 'react';
import API from '../API'


function ListaAperti(props) {

    const [errorMsg, setErrorMsg] = useState('');
  
  
    return (
      <>
        <Navigation logOut={props.logOut} loggedIn={props.loggedIn} user={props.user} />
        {props.initialLoading ? <Loading />
          : (
            <>
              <Container>
                {props.message ? <Alert variant='danger' onClose={() => props.setMessage('')} dismissible>{props.message}</Alert> : false}
                <Row className="justify-content-md-center pt-4">
                  <Col md='auto' >
                    <h2> Lista degli indovinelli aperti disponibili</h2>
                  </Col>
                </Row>
                <Row className='mt-5'>
                  {errorMsg ? <Alert variant='danger' onClose={() => setErrorMsg('')} dismissible>{errorMsg}</Alert> : ''}
                </Row>
                <Row>
                  <Table bordered hover className='border border-info'>
                    <thead>
                      <tr>
                        <th>Domanda</th>
                        <th>Stato</th>
                        <th>Difficoltà</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        props.allIndovinelliAperti.map((ind) => <AllApertiRow ind={ind} key={ind.id} setErrorMsg={setErrorMsg} user={props.user} />)
                      }
                    </tbody>
                  </Table>
                </Row>
              </Container>
            </>
          )}
      </>
    )
  }
  
  function AllApertiRow(props) {
  
  
    const navigate = useNavigate();
  
    const checkRisposta = async () => {
      try {
        await API.getRispostaById(props.ind.id);
  
        if (props.ind.userId === props.user.id) {
          props.setErrorMsg("Sei tu l'autore di questo indovinello!  Seleziona un altro indovinello");
        } else {
          navigate(`/guess/${props.ind.id}`);
        }
      }
      catch (err) {
        props.setErrorMsg('Stai provando a rispondere ad un indovinello a cui hai già risposto!  Seleziona un altro indovinello');
      }
    }
  
    const placement = 'top'
    return (
      <>
        <OverlayTrigger
          placement={placement}
          overlay={
            <Tooltip id={`tooltip-opwn`}>
              <strong>Click per provare a rispondere</strong>.
            </Tooltip>
          }
        >
          <tr onClick={checkRisposta} className='over-row'  >
            <td>
              {props.ind.domanda}
            </td>
            <td>
              {props.ind.stato}
            </td>
            <td>
              {props.ind.difficolta}
            </td>
          </tr>
        </OverlayTrigger>
      </>
    )
  }
  
  function ListaChiusi(props) {
  
    return (
      <>
        <Navigation logOut={props.logOut} loggedIn={props.loggedIn} user={props.user} />
        {props.initialLoading ? <Loading /> : (
          <Container>
            {props.message ? <Alert variant='danger' onClose={() => props.setMessage('')} dismissible>{props.message}</Alert> : false}
            <Row className="justify-content-md-center pt-4">
              <Col md='auto' >
                <h2> Lista degli indovinelli chiusi disponibili</h2>
              </Col>
            </Row>
            <Row>
              <Table bordered hover className='mt-5 border border-info' >
                <thead>
                  <tr >
                    <th>Domanda</th>
                    <th>Stato</th>
                    <th>Difficoltà</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    props.allIndovinelliChiusi.map((ind) => <AllChiusiRow ind={ind} key={ind.id} />)
                  }
                </tbody>
              </Table>
            </Row>
          </Container>)}
      </>
    )
  
  }
  
  function AllChiusiRow(props) {

    const [show, setShow] = useState(false);
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);  
  
    const placement = 'top';
  
    return (
      <>
        <OverlayTrigger
          placement={placement}
          overlay={
            <Tooltip id={`tooltip-${placement}`}>
              <strong>Click per le informazioni sull'indovinello</strong>.
            </Tooltip>
          }
        >
          <tr onClick={handleShow} className='over-row'>
            <td>
              {props.ind.domanda}
            </td>
            <td>
              {props.ind.stato}
            </td>
            <td>
              {props.ind.difficolta}
            </td>
            <td>
            <i className="bi bi-info-circle icon-size" ></i>
            </td>
          </tr>
        </OverlayTrigger>
  
  
  
        <Modal show={show} onHide={handleClose} size="lg">
          <Modal.Header closeButton className='bg-secondary'>
            <Modal.Title id="contained-modal-title-vcenter">
              <p className='text-light' >Informazioni sull'indovinello selezionato </p>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container>
              <Row>
                <Col>
                  <Row>
                    <h2> <strong>Domanda:</strong> </h2>
                    <h3> {props.ind.domanda}</h3>
  
                  </Row>
                  <Row className='mt-3'>
                    <>
                      <h2> <strong>Risposta corretta: </strong> </h2>
                      <h3>{props.ind.risposta} </h3>
                    </>
                  </Row>
                </Col>
                <Col>
                  <h2>  <strong>Risposte fornite: </strong> </h2>
                  <Container>
                    {props.ind.tentativi.map(r => <Row key={r}> <h3>{r}</h3> </Row>)}
                  </Container>
  
                </Col>
              </Row>
            </Container>
          </Modal.Body>
          {props.ind.vincitore ?
            (<Modal.Footer className='bg-success'>
              <Modal.Body>
                <h2 className='text-light'>
                  <strong>Vincitore: </strong> {props.ind.vincitore}
                </h2>
              </Modal.Body>
            </Modal.Footer>) :
            (<Modal.Footer className='bg-warning'>
              <Modal.Body>
                <h2 className='text-light'>
                  <strong>Nessun vincitore </strong>
                </h2>
              </Modal.Body>
            </Modal.Footer>)
          }
  
        </Modal>
      </>
    )
  }

  export{ListaAperti, ListaChiusi}