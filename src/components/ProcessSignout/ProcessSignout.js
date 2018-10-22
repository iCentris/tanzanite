import React, { Component } from "react";
import querystring from "query-string";
import { withAuth } from "../AuthContext";

class ProcessSignout extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
      initialized: false,
      isSuccess: false,
      return_url: "/",
      error: null
    };

    this.state = this.initialState;

    this.retrieveReturnUrl = this.retrieveReturnUrl.bind(this);
  }

  retrieveReturnUrl(search) {
    return querystring.parse(search).payload || this.state.return_url;
  }

  componentDidMount() {
    Promise.resolve()
      .then(() => {
        const return_url = this.retrieveReturnUrl(this.props.location.search);
        return return_url;
      })
      .then(return_url => {
        return this.props.auth.signout().then(() => {
          this.setState({
            initialized: true,
            isSuccess: true,
            return_url,
            error: null
          });
        });
      })
      .catch(error => {
        //signout isn't implemented yet server side
        this.setState({
          initialized: true,
          isSuccess: false,
          error
        });
      });
  }

  render() {
    const { initialized, isSuccess, return_url, error } = this.state;
    if (!initialized) return <div>Processing signout request...</div>;
    if (!isSuccess)
      return (
        <div>
          We're sorry, but we were unable to signout because:
          {error.message}
        </div>
      );

    return (
      <React.Fragment>
        Congratulations, signout was successful.
        <br />
        <a href={return_url}>
          <button>Go to Return URL</button>
        </a>
      </React.Fragment>
    );
  }
}

export default withAuth(ProcessSignout);
