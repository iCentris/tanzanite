# Topaz Auth / React Implementation for Avon Test Environment

The topaz architecture implements a JWT token authentication and authorization scheme.  This example includes a working barebones authentication-protected React application that connects to Topaz's Auth functionality and persists authentication state via [Store.js](https://github.com/marcuswestin/store.js/), localStorage for most browsers.

## Setup Frontend Example (served via Node)

1. Install latest [Node.js](https://nodejs.org/en/) (11.0.0 currently)

2. Clone this repo

```bash
git clone https://github.com/iCentris/tanzanite.git
cd tanzanite/auth-signin-react-avon
```
3. Install latest [yarn](https://yarnpkg.com/en/docs/install) package manager

4. Install npm dependencies:

```bash
yarn install
```

5. Start the tanzanite example server on `localhost:3000`

```bash
yarn start
```

6. Now open browser to http://localhost:3000 and you're all set!

## Usage

**Username**: avon's rep account number (rep.acct_nr)

**Password**: md5 signature hash (same as sent to Web Office)

## Architecture overview

`/auth/v1/access`

- Validates whether the current $access_token is valid (passed over in `authorization: bearer $access_token` header)
- Returns `200 OK` status if good, or a `400` level error if invalid or not found (if not 200 OK then bad is our logic)

`/auth/v1/signin`

- Accepts `POST` with `username` (rep.acct_nr) and `password` (md5 Web Office Hash)
- `200 OK` on success, `404 not found` on failure
- If successful, includes `refresh_request` that you then use for the following endpoint to actually get the `access_token`

`/auth/v1/refresh`

- Accepts `POST` with the client assertion payload and JWT generated from `refresh_request` /signin returns.  For more details on this, please see details in [Auth.js](https://github.com/iCentris/tanzanite/blob/2c8932ea9b3d1b844fe9b63dac7cb918bfdf8d2a/auth-signin-react-avon/src/lib/Auth/Auth.js#L84)
- Returns an `access_token` good for up to 15 minutes.

`/auth/v1/signout`

- Accepts `POST` and expects `authorization: bearer $access_token` header
- Kills the `access_token` and the `refresh_request` so a full login sequence will be required next visit.
