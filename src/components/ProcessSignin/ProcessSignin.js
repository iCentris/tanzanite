import React, { Component } from "react";
import querystring from "query-string";
import { withAuth } from "../AuthContext";

class ProcessSignin extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
      initialized: false,
      isSuccess: false,
      return_url: "/",
      error: null
    };

    this.state = this.initialState;

    this.retrieveVars = this.retrieveVars.bind(this);
  }

  retrieveVars(search) {
    const { signin_payload, return_url = this.state.return_url } = JSON.parse(
      querystring.parse(search).payload
    );
    return { signin_payload, return_url };
  }

  componentDidMount() {
    Promise.resolve()
      .then(() => {
        const { signin_payload, return_url } = this.retrieveVars(
          this.props.location.search
        );
        if (!signin_payload) return Promise.reject("No signin_payload");

        return { signin_payload, return_url };
      })
      .then(({ signin_payload, return_url }) => {
        return this.props.auth.signinAndRefresh(signin_payload).then(() => {
          this.setState({
            initialized: true,
            isSuccess: true,
            return_url,
            error: null
          });
        });
      })
      .catch(error => {
        this.setState({
          initialized: true,
          isSuccess: false,
          error
        });
      });
  }

  render() {
    const { initialized, isSuccess, return_url } = this.state;
    if (!initialized) return <div>Processing signin request...</div>;
    if (!isSuccess)
      return (
        <div>
          We're sorry, but we were unable to process because:
          {this.state.error.message}
        </div>
      );

    return (
      <div>
        Congratulations, siginin was successful.
        <br />
        <a href={return_url}>
          <button>Go to Return URL</button>
        </a>
      </div>
    );
  }
}

export default withAuth(ProcessSignin);
