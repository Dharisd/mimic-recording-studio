import React, { Component} from "react";
import { Link } from "react-router-dom";
import "./App.css";
import logo from "./assets/logo.svg";
import { AuthContext } from "./AuthContext";

class Header extends Component {

  render() {
    return (
      <AuthContext.Consumer>
        {({ user, logout }) => (
          <div className="topnav">
            <Link to="/">
              <img className="logo" src={logo} height="40px" alt=""/>
            </Link>
            <div className="nav-links">
              {user ? (
                  <React.Fragment>
                    <span className="username">{user.user_name}</span>
                    <button onClick={logout} className="logout-button">
                      Logout
                    </button>
                  </React.Fragment>
              ) : (
                <Link to="/login" className="login-link">
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </AuthContext.Consumer>
    );
  }
}

export default Header;
