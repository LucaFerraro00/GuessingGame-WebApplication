import { Form, Button, Alert, Container, Row, Col, Card } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'


function LoginForm(props) {

  const navigate = useNavigate();

  const [username, setUsername] = useState('inserici email qui');
  const [password, setPassword] = useState('inserisci password qui');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrorMessage('');
    const credentials = { username, password };
    let valid = true;
    if (username === '' || password === '')
      valid = false;
    if (valid) {
      props.doLogIn(credentials);
    }
    else {
      setErrorMessage('Inserisci email e password correttamente')
    }
  };

  return (
    <Container className='below-nav' >
      <Row className="justify-content-md-center ">
      <Col  md="auto"> <h1 className='text-info'> Benvenuto in Indovinelli! </h1></Col>
      </Row>

      <Card  >
      {errorMessage ? <Alert variant='danger'>{errorMessage}</Alert> : ''}
      {props.message ? <Alert variant='danger' onClose={() => props.setMessage('')} dismissible>{props.message}</Alert> : false}
      <div className="color-overlay d-flex justify-content-center align-items-center mb-3 ">
        <Row>
          <Form className="rounded p-4 p-sm-3 mb-3">
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label> <h2 className='text-dark'> Email address </h2></Form.Label>
              <Form.Control type="email" value={username} onChange={ev => setUsername(ev.target.value)} />
              </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label> <h2 className='text-dark'>Password </h2></Form.Label>
              <Form.Control type="password" value={password} onChange={ev => setPassword(ev.target.value)} />
            </Form.Group>
            <Button variant="secondary" onClick={handleSubmit}>
              Login
            </Button>
          </Form>
        </Row>
        </div>
        </Card>
        <Row  className="justify-content-md-center p-4 ">
          <Col md="auto">
          <Button variant="info" onClick={() => {navigate('/anonymous');} }> Continua come utente anonimo</Button>
          </Col>
        </Row>
      
    </Container>
  )
}



export { LoginForm };