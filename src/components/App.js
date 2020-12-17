import './App.css';
import { Switch, Route } from 'react-router-dom';
import { Router } from 'react-router';

import Navbar from './Navbar';
import Login from './Login';
import Adherent from './Adherents';
import MemberCreation from './MemberCreation';
import history from '../history';
import { UserProvider } from './_context/UserContext';

const App = () => {
  // Je laisse ce code, j'ai tenté de cacher la navbar
  // au login avec un useEffect mais sans succès
  // Je dois recharger la page sur adherents pour qu'elle s'affiche
  // j'ai donc utilisé withRouter dans le composant Navbar....

  /* const path = history.location.pathname;
  const [show, setShow] = useState('/');

  useEffect(() => {
    console.log(show);
    console.log(history.location.pathname);
    setShow(path);
  }, [show]); */
  return (
    <div>
      <UserProvider>
        <Router history={history}>
          <Navbar />
          {/* {show !== '/' && <Navbar />} */}
          <div className="App">
            <Switch>
              <Route exact path="/" component={Login} />
              <Route exact path="/adherents" component={Adherent} />
              <Route
                exact
                path="/adherents/creation"
                component={MemberCreation}
              />
              <Route exact path="/adherents/:id" />
              <Route exact path="/articles" />
              <Route exact path="/articles/:id" />
              <Route path="/articles/creation" />
              <Route exact path="/garden" />
              <Route path="/garden/:id" />
              <Route path="/garden/creation" />
              <Route path="/calendar" />
            </Switch>
          </div>
        </Router>
      </UserProvider>
    </div>
  );
};

export default App;
