import React, { Component } from "react";
import { Redirect } from 'react-router-dom';
import { AuthContext } from "./AuthContext";

class Login extends Component {

  state = {
    username: "",
    password: "",
    error: "",
    redirectToReferrer: false,
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = async (e, login) => {

    e.preventDefault();

    const { username, password } = this.state;

    console.log(login)

    try {
      const success = await login(username, password);
      if(success) {
        this.setState({ redirectToReferrer: true });
    } else {
      this.setState({ error: 'Invalid credentials' });
    }
    } catch (err) {
      this.setState({ error: "Login failed. Please try again." });
    }
  };

  render() {
    const { username, password, error, redirectToReferrer } = this.state;
    const { from } = this.props.location.state || { from: { pathname: '/record' } };

    if (redirectToReferrer) {
      return <Redirect to={from} />;
    }

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

export default Login;