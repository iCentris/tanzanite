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
    return window.location.href;
  }

  getLoginUrl() {
    return this.props.auth.getLoginUrl(this.getReturnUrl());
  }

  render() {
    const { isVerified } = this.props.auth;

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
        <a href={this.getLoginUrl()}>
          <button>Login</button>
        </a>
      </div>
    );
  }
}

export default withAuth(ProtectedApp);
