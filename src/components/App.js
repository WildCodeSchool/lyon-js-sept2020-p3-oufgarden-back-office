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
          <Route exact path="/admin" />
          <Route path="/admin/home" />
          <Route exact path="/admin/adherents" />
          <Route
            exact
            path="/admin/adherents/creation"
            component={MemberCreation}
          />
          <Route exact path="/admin/adherents/:id" />
          <Route exact path="/admin/articles" />
          <Route exact path="/admin/articles/:id" />
          <Route path="/admin/articles/creation" />
          <Route exact path="/admin/garden" />
          <Route path="/admin/garden/:id" />
          <Route path="/admin/garden/creation" />
          <Route path="/admin/calendar" />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
