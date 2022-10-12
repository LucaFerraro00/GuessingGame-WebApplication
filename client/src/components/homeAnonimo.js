
import React, { useState, useEffect } from 'react';
import { Row, Container, Table, Alert } from 'react-bootstrap/'
import API from '../API'
import { NavigationAnonymous } from './navbar'



function MainPageAnonimo(props) {

  const [indovinelli, setIndovinelli] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const [errors, setErrors] = useState('');

  useEffect(() => {
    API.getAllIndovinelli()
      .then(indovinelli => {
        setIndovinelli(indovinelli);
      })
      .catch(e => { setErrors(e) });  
      clearInterval(props.appInterval)
  }, []);


  useEffect(() => {
    const loadUsers= async() =>{
      try{
        let users = await API.getOrderedScores();
        setTopUsers(users);
      }catch (err){
        setErrors(err)
      }
    }
    loadUsers()
  }, [])



  return (
    <>
      <NavigationAnonymous logOut={props.logOut} loggedIn={props.loggedIn} />
      {props.message ? <Alert variant='danger' onClose={() => props.setMessage('')} dismissible>{props.message}</Alert> : false}
      {errors ? <Alert variant='danger' onClose={() => setErrors('')} dismissible>{errors}</Alert> : false}
      <Container className='below-nav'>
        <Row>
          <h2>Indovinelli disponibili</h2>
        </Row>

        {/*Tabella per la lista di tutti gli indovinelli*/}
        <Row>
          <Table bordered >
            <thead>
              <tr>
                <th>Domanda</th>
                <th>Difficolta</th>
                <th>Stato</th>
              </tr>
            </thead>
            <tbody>
              {
                indovinelli.map((indovinello) => <AnonimoRow key={indovinello.id} indovinello={indovinello} />)
              }
            </tbody>
          </Table>
        </Row>
        <Row className='mt-4'>
          <h2>Classifica Utenti</h2>
        </Row>

        {/*Tabella per la classifica degli utenti con il punteggio più alto (top3)*/}
        <Row>
          <Table bordered >
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
        </Row>
      </Container>
    </>
  )

}

function AnonimoRow(props) {

  return (
    <tr>
      <td>
        {props.indovinello.domanda}
      </td>
      <td>
        {props.indovinello.difficolta}
      </td>
      <td>
        {props.indovinello.stato}
      </td>

    </tr>
  )

}


function ClassificaRow(props) {

  return (
    <>
      <tr>
        <td>
          {props.user.nome} {props.user.cognome}
        </td>
        <td>
          {props.user.score}
        </td>
      </tr>
    </>
  )

}

export { MainPageAnonimo , ClassificaRow}