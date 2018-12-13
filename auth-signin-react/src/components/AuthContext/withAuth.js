import React from 'react'
import { AuthConsumer } from './index'
import getDisplayName from 'react-display-name'

const withAuth = WrappedComponent => {
  const wrapped = props => (
    <AuthConsumer>{auth => <WrappedComponent {...props} auth={auth} />}</AuthConsumer>
  )

  wrapped.displayName = `wrapped(${getDisplayName(WrappedComponent)})`
  return wrapped
}

export default withAuth
