import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Articles from "./Articles";
import ArticleCreation from "./ArticleCreation";

const App = () => {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Switch>
          <Route exact path="/adherents" />
          <Route path="/adherents/:id" />
          <Route path="/adherents/creation" />
          <Route exact path="/articles" component={Articles} />
          <Route exact path="/articles/creation" component={ArticleCreation} />
          <Route exact path="/articles/:id" />
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
