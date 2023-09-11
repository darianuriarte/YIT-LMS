import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import UserContext from './UserContext';

class ProtectedRoute extends React.Component {
  static contextType = UserContext;

  render() {
    const { component: Component, allowedRoles, ...rest } = this.props;
    const { role } = this.context;

    return (
      <Route {...rest} render={props => {
        // If not logged in, redirect to login
        if (!role) {
          return <Redirect to="/login" />;
        }

        // If user's role is not allowed, redirect to default page
        if (allowedRoles && !allowedRoles.includes(role)) {
          return <Redirect to="/default" />;
        }

        // Else render the component
        return <Component {...props} />;
      }} />
    );
  }
}

export default ProtectedRoute;