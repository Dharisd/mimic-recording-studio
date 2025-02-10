import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import { AuthContext } from "./AuthContext";

class Login extends Component {

  state = {
    username: "",
    password: "",
    error: "",
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = async (e, login) => {

    e.preventDefault();

    const { username, password } = this.state;
    const { history } = this.props;

    console.log(login)

    try {
      await login(username, password);
      history.push("/");
    } catch (err) {
      this.setState({ error: "Invalid credentials" });
    }
  };

  render() {
    const { username, password, error } = this.state;
    return (
      <AuthContext.Consumer>
        {({ login }) => (
          <div>
            <h1>Login</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={e => this.handleSubmit(e, login)}>
              <input
                type="text"
                placeholder="Username"
                name="username"
                value={username}
                onChange={this.handleChange}
              />
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={password}
                onChange={this.handleChange}
              />
              <button type="submit">Login</button>
            </form>
          </div>
        )}
      </AuthContext.Consumer>
    );
  }
};

export default withRouter(Login);