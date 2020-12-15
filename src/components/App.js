import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navbar from './Navbar';
import LoginF from './LoginF';
import Adherent from './Adherents';
import MemberCreation from './MemberCreation';
import GardenCreation from './GardenCreation';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Switch>
          <Route exact path="/" component={LoginF} />
          <Route path="/home" />
          <Route exact path="/adherents" component={Adherent} />
          <Route exact path="/adherents/creation" component={MemberCreation} />
          <Route exact path="/adherents/:id" />
          <Route exact path="/articles" />
          <Route exact path="/articles/:id" />
          <Route path="/articles/creation" />
          <Route exact path="/garden" />
          <Route path="/garden/creation" component={GardenCreation} />
          <Route path="/garden/:id" />
          <Route path="/calendar" />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
