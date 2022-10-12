import 'bootstrap/dist/css/bootstrap.min.css';
import {LoginForm} from './components/LoginComponents'
import { MainPageUser,  ApertoDettagli, ChiusoDettagli} from './components/UserComponents'
import {MainPageAnonimo} from './components/homeAnonimo'
import {GuessForm} from './components/GuessForm'
import {ListaAperti, ListaChiusi} from './components/TuttiIndovinelli'
import { AddIndovinelloForm} from './components/NewIndovinelloForm'
import API from './API'
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate} from 'react-router-dom';
import { useEffect } from 'react';
import  {useState} from 'react';
import dayjs from 'dayjs';
import './App.css'

function App() {
  return (
    <Router>
      <App2 />
    </Router>
  )
}

function App2() {

  const [loggedIn, setLoggedIn] = useState(false);  
  const [user, setUser] = useState({});
  const [message, setMessage] = useState(''); 

  const [indovinelli, setIndovinelli] = useState([]); //tutti gli indovinelli
  const [allIndovinelliAperti, setAllIndovinelliAperti] = useState([]); //tutti gli indovinelli aperti
  const [allIndovinelliChiusi, setAllIndovinelliChiusi] = useState([]); //tutti gli indovinelli chiusi

  const [myIndovinelliAperti, setMyindovinelliAperti] = useState([]); //indovinelli aperti dell'utente che ha fatto login
  const [myIndovinelliChiusi, setMyindovinelliChiusi] = useState([]); //indovinelli chiusi dell'utente che ha fatto login

  const [startPolling, setStartPolling]=useState(false); //usato per far partire l'interval
  const [intervalId, setIntevalId] = useState(''); //id usato per fare clearInterval

  const [polling, setPolling] = useState(false); 

  const [initialLoading, setInitialLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(()=> {
    const checkAuth = async() => {
      try {
        const user = await API.getUserInfo();
        setLoggedIn(true);
        setUser(user);
      } catch(err) {}
    };
    checkAuth();
  }, []);

 
  const doLogIn = (credentials) => {
    API.logIn(credentials)
      .then( user => {
        setLoggedIn(true);
        setUser(user);
        setMessage('');
        navigate('/');
      })
      .catch(err => {
        setMessage(err);
      }
        )
  }

  const doLogOut = async () => {
    await API.logOut();
    setLoggedIn(false);
    clearInterval(intervalId);
    setInitialLoading(true)
    setUser({});
    navigate('/');
  }

  useEffect(() => {
    if (loggedIn){
      API.getAllIndovinelli()
        .then(indovinelii => {
          setAllIndovinelliAperti(indovinelii.filter((ind) => (ind.stato === 'aperto')));
          setAllIndovinelliChiusi(indovinelii.filter((ind) => (ind.stato === 'chiuso')));
          setTimeout(setInitialLoading(false), 3000) 
          setStartPolling(true);
        })
        .catch(e => { setMessage('Errore nel server') });
    }
  }, [loggedIn])

  useEffect(() => {
    if (polling){
     API.getAllIndovinelli()
        .then(indovinelii => {
          setIndovinelli(indovinelii)

          let myIndovinelli = indovinelii.filter((ind)=>(ind.userId === user.id))
          setMyindovinelliAperti(myIndovinelli.filter((ind) => (ind.stato === 'aperto')))
          setMyindovinelliChiusi(myIndovinelli.filter((ind) => (ind.stato === 'chiuso')))

          let aperti = (indovinelii.filter((ind) => (ind.stato === 'aperto')));
          let chiusi = (indovinelii.filter((ind) => (ind.stato === 'chiuso')));
          aperti.map((a)=>{
            if(a.inizio){
              let inizio = dayjs(a.inizio);
              let fine = inizio.add(a.durata, 'second');
              let diff = fine.diff(dayjs(), 'second');
              if (diff <= 0) {
                API.updateStatoChiuso(a.id);
              }
            }
            return ('')
          })
          setAllIndovinelliAperti(aperti);
          setAllIndovinelliChiusi(chiusi);
          setInitialLoading(false);
          setPolling(false);
        })
        .catch(e => { setMessage('Errore nel server') });
    }
  }, [polling])


  useEffect(() => {
    if(startPolling) {
      let id = setInterval(intervalf, 1000);
      setIntevalId(id) 
      setStartPolling(false)
    }
  }, [startPolling]);

  async function intervalf(){
    setPolling(true)
  }

  return (
    <>
      <Routes>
        <Route path='/' element=
        {loggedIn? (
        <MainPageUser setMessage={setMessage} message={message} user={user} logOut={doLogOut} loggedIn={loggedIn} myIndovinelliAperti={myIndovinelliAperti} myIndovinelliChiusi={myIndovinelliChiusi} initialLoading={initialLoading} setInitialLoading={setInitialLoading} setStartPolling={setStartPolling}/>)
        : <Navigate to ='/login'/>  } />
        <Route path= "/anonymous" element  = {<MainPageAnonimo logOut={doLogOut} loggedIn={loggedIn} message={message} setMessage={setMessage} appInterval={intervalId}  />} />
        <Route path='/add'  element={<AddIndovinelloForm indovinelli= {indovinelli} setIndovinelli={setIndovinelli} appInterval={intervalId} setStartPolling={setStartPolling}  logOut={doLogOut} loggedIn={loggedIn} user={user} setInitialLoading={setInitialLoading}/>}/>
        <Route path='/login' element={loggedIn ? <Navigate to='/' /> : <LoginForm doLogIn={doLogIn}  message={message} setMessage={setMessage}/>  } />
        <Route path='/tuttiChiusi' element={<ListaChiusi message={message} setMessage={setMessage} logOut={doLogOut} loggedIn={loggedIn} user={user}  allIndovinelliChiusi={allIndovinelliChiusi} initialLoading={initialLoading}/>} />
        <Route path='/tuttiAperti' element={<ListaAperti message={message} setMessage={setMessage} logOut={doLogOut} loggedIn={loggedIn} user={user}  allIndovinelliAperti={allIndovinelliAperti} initialLoading={initialLoading}/>}/>
        <Route path='/guess/:indovinelloId' element={<GuessForm logOut={doLogOut} loggedIn={loggedIn} user={user} appInterval={intervalId} setStartPolling={setStartPolling} />}/>
        <Route path='/aperto/:indovinelloId' element={<ApertoDettagli logOut={doLogOut} loggedIn={loggedIn} user={user} appInterval={intervalId} setStartPolling={setStartPolling}startPolling={startPolling}/>}/>
        <Route path='/chiuso/:indovinelloId' element={<ChiusoDettagli logOut={doLogOut} loggedIn={loggedIn} user={user} appInterval={intervalId} setStartPolling={setStartPolling}/>}/>
      </Routes> 
    </>
  );
}


export default App;
