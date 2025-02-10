import React, { Component, createContext } from 'react';
import { getUUID, removeUUID, setUUID } from "./api/localstorage";
import { getUser, loginUser, logoutUser } from './api';

export const AuthContext = createContext(null);

export class AuthProvider extends Component {
  state = {
    user: null,
    loading: true
  };

  componentDidMount() {
    this.checkAuth();
  }

  checkAuth = async () => {
    const uuid = getUUID();
    console.log('uuid', uuid)
    if (uuid) {
      try {
        const response = await getUser();
        if (response.ok) {
          const data = await response.json();
          this.setState({ user: data.data });
          setUUID(data.data.uuid)
        } else {
          removeUUID()
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      }
    }
    this.setState({ loading: false });
  };

  login = async (username, password) => {
    try {
      const response = await loginUser(username, password)

      if (response.ok) {
        const data = await response.json();
        this.setState({ user: data.data });
        setUUID(data.data.uuid);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  logout = async () => {
    try {
      await logoutUser();
      this.setState({ user: null });
      removeUUID()
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  render() {
    const { children } = this.props;
    const { user, loading } = this.state;

    const value = {
      user,
      loading,
      login: this.login,
      logout: this.logout
    };

    return (
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
    );
  }
}