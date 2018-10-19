import React, { Component } from "react";
import { withAuth } from "../AuthContext";

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
    const { isVerified } = this.props.auth.state;

    if (isVerified)
      return <div>Welcome to the protected App. Enjoy your stay!</div>;

    return (
      <div>
        Unauthorized access, please
        <a href={this.getLoginUrl()}>
          <button>Login</button>
        </a>
      </div>
    );
  }
}

export default withAuth(ProtectedApp);
