import React, { Component } from "react";

class LoginForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;

    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    return this.props.handleSubmit(this.state);
  }

  render() {
    return (
      <form id="signin_form" method="post" onSubmit={this.handleSubmit}>
        Username:
        <br />
        <input
          id="username"
          name="username"
          type="text"
          onChange={this.handleChange}
          value={this.state.username}
        />
        <br />
        Password:
        <br />
        <input
          id="password"
          name="password"
          type="password"
          onChange={this.handleChange}
          value={this.state.password}
        />
        <br />
        <input type="submit" value="Signin" />
      </form>
    );
  }
}

export default LoginForm;
