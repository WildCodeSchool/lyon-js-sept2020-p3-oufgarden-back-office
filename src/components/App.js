import './App.css';
import { Switch, Route } from 'react-router-dom';
import { Router } from 'react-router';
import { ToastProvider } from 'react-toast-notifications';
import Navbar from './Navbar';
import Login from './Login';
import Adherents from './Adherents';
import TagsPage from './TagsPage';
import MemberCreation from './MemberCreation';
import history from '../history';
import { UserProvider } from './_context/UserContext';
import ArticleCreation from './ArticleCreation';
import Garden from './Garden';
import GardenCreation from './GardenCreation';
import ArticleList from './ArticleList';
import MemberDetail from './MemberDetail';

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

                <Route path="/adherents/creation" component={MemberCreation} />
                <Route path="/adherents/edit/:id" component={MemberCreation} />
                <Route path="/adherents/:id" component={MemberDetail} />
                <Route exact path="/adherents" component={Adherents} />

                <Route exact path="/articles" component={ArticleList} />

                <Route
                  exact
                  path="/articles/creation"
                  component={ArticleCreation}
                />
                <Route exact path="/articles/:id" component={ArticleCreation} />
                <Route exact path="/category" component={TagsPage} />
                <Route exact path="/garden" component={Garden} />
                <Route path="/garden/creation" component={GardenCreation} />
                <Route path="/garden/:id" component={GardenCreation} />
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
