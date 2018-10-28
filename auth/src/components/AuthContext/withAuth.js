import React from "react";
import { AuthConsumer } from "./index";

const withAuth = Component => {
  return props => (
    <AuthConsumer>{auth => <Component {...props} auth={auth} />}</AuthConsumer>
  );
};

export default withAuth;
