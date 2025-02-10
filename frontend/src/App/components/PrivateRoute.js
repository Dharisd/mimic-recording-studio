import React from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "../AuthContext";

const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <AuthContext.Consumer>
      {({ user }) => (
        <Route
          {...rest}
          render={(props) =>
              user || props.location.pathname === '/login' ? (
              <Component {...props} />
            ) : (
              <Redirect to="/login" />
            )
          }
        />
      )}
    </AuthContext.Consumer>
  );
}

export default PrivateRoute;