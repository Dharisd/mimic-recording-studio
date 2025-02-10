import React, { Component} from "react";
import { Link } from "react-router-dom";
import "./App.css";
import logo from "./assets/logo.svg";
import { AuthContext } from "./AuthContext";

class Header extends Component {
  static contextType = AuthContext;

  handleLogout = async (e) => {
    e.preventDefault();
    await this.context.logout();
  };

  render() {
    const { user } = this.context;


    return (
      <div className="topnav">
        <Link to="/">
          <img className="logo" src={logo} height="40px" alt=""/>
        </Link>
        <div className="nav-links">
          {user ? (
              <button onClick={this.handleLogout} className="logout-button">
                Logout
              </button>
          ) : (
            <Link to="/login" className="login-link">
              Login
            </Link>
          )}
        </div>
      </div>
    );
  }
}

export default Header;
