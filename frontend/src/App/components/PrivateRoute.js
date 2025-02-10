import React from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "../AuthContext";

const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <AuthContext.Consumer>
      {({ user, loading }) => (
        <Route
          {...rest}
          render={(props) =>
            loading ? (
              <div className="loading-container">
                <div className="loading-spinner">Loading...</div>
              </div>
            ) : user || props.location.pathname === '/login' ? (
              <Component {...props} />
            ) : (
              <Redirect 
                to={{
                  pathname: "/login",
                  state: { from: props.location }
                }}
              />
            )
          }
        />
      )}
    </AuthContext.Consumer>
  );
}

export default PrivateRoute;