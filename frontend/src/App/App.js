import React, { Component } from "react";
import "./App.css";
import PrivateRoute from "./components/PrivateRoute";
import Header from "./Header";
import Intro from "./Intro";
import Record from "./Record";
import Tutorial from "./Tutorial";
import Login from "./Login";
import { getUUID } from "./api/localstorage";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { AuthProvider } from "./AuthContext";

const routes = [
  { path: "/login", component: Login, isPrivate: false },
  { path: "/", component: Intro, isPrivate: true },
  { path: "/record", component: Record, isPrivate: true },
  { path: "/tutorial", component: Tutorial, isPrivate: true },
];

class App extends Component {
  componentDidMount(){
    if (!getUUID()){
    }
  }

  render() {
    return (
      <AuthProvider>
        <Router onUpdate={() => window.scrollTo(0, 0)}>
          <div className="App">
            <Header />
            <div className="page">
              <Switch>
              {routes.map(({ path, component, isPrivate }, index) =>
                  isPrivate ? (
                    <PrivateRoute key={index} path={path} component={component} />
                  ) : (
                    <Route key={index} path={path} component={component} />
                  )
                )}
              </Switch>
            </div>
          </div>
        </Router>
      </AuthProvider>
    );
  }
}

export default App;
