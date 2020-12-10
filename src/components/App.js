import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from "./Navbar";
import MemberCreation from "./MemberCreation";

const App = () => {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Switch>
          <Route path="/home" />
          <Route exact path="/adherents" />
          <Route exact path="/adherents/creation" component={MemberCreation} />
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
  );
};

export default App;
