import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { Navbar, Container, Button , Nav, NavDropdown, Tooltip, OverlayTrigger} from 'react-bootstrap'
import { useNavigate, Link } from 'react-router-dom';


const Navigation = (props) => {

  const navigate = useNavigate();

  return (
    <>
      <Navbar bg="secondary" >
        <Container >
          <Link to='/'>
          <Navbar.Brand >
          <i className="bi bi-house-door icon-size"></i>
          </Navbar.Brand>
          </Link>
          <Nav className="me-auto">
          <NavDropdown title="Tutti gli indovinelli disponibili" id="basic-nav-dropdown">
          <NavDropdown.Item  onClick={()=>navigate('/tuttiAperti')}>Ancora aperti</NavDropdown.Item>
          <NavDropdown.Item  onClick={()=>navigate('/tuttiChiusi')}>Già chiusi</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item  onClick={()=>navigate('/')}>I miei indovinelli</NavDropdown.Item>
        </NavDropdown>
        </Nav>
          <Navbar.Brand>
          <OverlayTrigger placement={'bottom'}  overlay={
             <Tooltip >
              Score: {props.user.score}
            </Tooltip>
          }
        >
          <i className="bi bi-person-circle icon-size"></i>
          </OverlayTrigger>
        <Navbar.Text className="mx-2">
           {props.user && props.user.name && `${props.user.name} ${props.user.surname} `} 
        </Navbar.Text>
          </Navbar.Brand>
          <LogButton logOut={props.logOut} loggedIn={props.loggedIn} />
        </Container>
      </Navbar>
    </>
  )
}


const NavigationAnonymous = (props) => {

  const navigate = useNavigate();

  return (
    <>
      <Navbar bg="secondary" >
        <Container >
           <Navbar.Brand >
           <i className="bi bi-house-door icon-size"></i>
          </Navbar.Brand>
          <Navbar.Brand>
          <i className="bi bi-person-x icon-size"></i>
         <Navbar.Text className="mx-2">
          <em>Utente non registrato</em>
        </Navbar.Text>
        </Navbar.Brand>
          <LogButton logOut={props.logOut} loggedIn={props.loggedIn} />
        </Container>
      </Navbar>
    </>
  )
}



const LogButton = (props) => {

  const navigate = useNavigate();

  return (
    <>
      {props.loggedIn ? <Button variant="dark " onClick={props.logOut} > Logout </Button> :
        <Button variant="dark" onClick={() => { navigate('/') }}> Login </Button>}
    </>

  );
}

export { Navigation, NavigationAnonymous }; 