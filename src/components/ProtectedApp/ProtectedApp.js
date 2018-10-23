import React, { Component } from "react";
import { withAuth } from "../AuthContext";
import { Link } from "react-router-dom";

class ProtectedApp extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
      return_url: "/"
    };

    this.getReturnUrl = this.getReturnUrl.bind(this);
  }

  getReturnUrl() {
    return window.location.pathname + window.location.search + window.location.hash;
  }

  getLoginUrl() {
    return this.props.auth.getLoginUrl(this.getReturnUrl());
  }

  render() {
    const { isVerified, initialized } = this.props.auth;

    if(!initialized) return <div>Initializing...</div>;

    if (isVerified) {
      return (
        <div>
          Welcome to the protected App. Enjoy your stay!
          <br />
          <Link to="/signout">
            <button>Signout</button>
          </Link>
        </div>
      );
    }

    return (
      <div>
        Unauthorized access, please <br />
        <Link to={this.getLoginUrl()}>
          <button>Login</button>
        </Link>
      </div>
    );
  }
}

export default withAuth(ProtectedApp);
