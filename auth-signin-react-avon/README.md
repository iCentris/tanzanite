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

## USAGE

**Username** = avon's rep account number (rep.acct_nr)
**Password** = md5 signature hash (same as sent to Web Office)
