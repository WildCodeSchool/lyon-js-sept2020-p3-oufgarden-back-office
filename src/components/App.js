import './App.css';
import { Switch, Route } from 'react-router-dom';
import { Router } from 'react-router';
import { ToastProvider } from 'react-toast-notifications';
import Navbar from './Navbar';
import Login from './Login';
import Adherent from './Adherents';
import TagsPage from './TagsPage';
import MemberCreation from './MemberCreation';
import history from '../history';
import { UserProvider } from './_context/UserContext';

const App = () => {
  return (
    <UserProvider>
      <ToastProvider>
        <Router history={history}>
          <div className="App">
            <Switch>
              <Route exact path="/" component={Login} />
              <Route path="/home" />
              <Route exact path="/adherents">
                <Navbar />
                <Adherent />
              </Route>
              <Route exact path="/category">
                <Navbar />
                <TagsPage />
              </Route>
              <Route exact path="/adherents/creation">
                <Navbar />
                <MemberCreation />
              </Route>
              <Route exact path="/adherents/:id">
                <Navbar />
              </Route>
              <Route exact path="/articles">
                <Navbar />
              </Route>
              <Route exact path="/articles/:id">
                <Navbar />
              </Route>
              <Route path="/articles/creation">
                <Navbar />
              </Route>
              <Route exact path="/garden">
                <Navbar />
              </Route>
              <Route path="/garden/:id">
                <Navbar />
              </Route>
              <Route path="/garden/creation">
                <Navbar />
              </Route>
              <Route path="/calendar">
                <Navbar />
              </Route>
            </Switch>
          </div>
        </Router>
      </ToastProvider>
    </UserProvider>
  );
};

export default App;
