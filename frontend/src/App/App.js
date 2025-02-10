import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";
import PrivateRoute from "./components/PrivateRoute";
import Header from "./Header";
import Intro from "./Intro";
import Record from "./Record";
import Tutorial from "./Tutorial";
import Login from "./Login";
import { getUUID } from "./api/localstorage";
import { AuthProvider } from "./AuthContext";

class App extends Component {
  componentDidMount(){
    if (!getUUID()){
    }
  }

  render() {
    return (
      <Router onUpdate={() => window.scrollTo(0, 0)}>
        <AuthProvider>
            <div className="App">
              <Header />
              <div className="page">
                <Route exact path="/" component={Intro} />
                <Route path="/login" component={Login} />
                <PrivateRoute path="/record" component={Record} />
                <PrivateRoute path="/tutorial" component={Tutorial} />
              </div>
            </div>
        </AuthProvider>
      </Router>
    );
  }
}

export default App;
