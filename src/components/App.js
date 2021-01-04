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
import MemberEdition from './MemberEdition';
import Articles from './Articles';
import ArticleCreation from './ArticleCreation';

const App = () => {
  return (
    <div>
      <ToastProvider placement="top-right">
        <UserProvider>
          <Router history={history}>
            <Navbar />
            <div className="App">
              <Switch>
                <Route exact path="/" component={Login} />
                <Route exact path="/adherents" component={Adherent} />
                <Route
                  exact
                  path="/adherents/creation"
                  component={MemberCreation}
                />
                <Route exact path="/adherents/:id" component={MemberEdition} />
                <Route exact path="/articles" component={Articles} />
                <Route exact path="/articles/:id" />
                <Route
                  exact
                  path="/articles/creation"
                  component={ArticleCreation}
                />
                <Route exact path="/category" component={TagsPage} />
                <Route exact path="/garden" />
                <Route path="/garden/:id" />
                <Route path="/garden/creation" />
                <Route path="/calendar" />
              </Switch>
            </div>
          </Router>
        </UserProvider>
      </ToastProvider>
    </div>
  );
};

export default App;
