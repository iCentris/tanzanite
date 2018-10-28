# Topaz Auth / React Implementation

The topaz architecture implements a JWT token authentication and authorization scheme.  This example includes a working barebones authentication-protected React application that connects to Topaz's Auth functionality and persists authentication state via [Store.js](https://github.com/marcuswestin/store.js/), localStorage for most browsers.

## Setup Frontend Example (served via Node)

1. Identify which Topaz/Vibes server you will use (See below--Local or Remote).

2. Install latest [Node.js](https://nodejs.org/en/) (11.0.0 currently)

3. Clone this repo

    git clone https://github.com/iCentris/tanzanite.git
    cd tanzanite

4. Install npm dependencies:

    npm install

5. Start the tanzanite example server on `localhost:3000`

    npm start

6. Now open browser to http://localhost:3000 and you're all set!

## Topaz Auth Server

You can use a customer environment (details TBD) or if you are a developer with local topaz development access, you can [run Topaz/Vibes locally](https://github.com/iCentris/vibes).

### Running Remote Topaz

Know the user to connect with.

### Running Topaz Locally

{{ TBD: this is something we can pull from the ecto seed info. }}

Update test user to username = `demo` and password = `password1`
    
    # install mysql client
    apk add mysql-client

    # login 
    mysql -u root -h db vibes_dev

Running commands from mysql:

    MariaDB [vibes_dev]> select id, username, encrypted_password from users;
    +----+----------+--------------------------------------------------------------+
    | id | username | encrypted_password                                           |
    +----+----------+--------------------------------------------------------------+
    |  1 | andy     | N/A |
    +----+----------+--------------------------------------------------------------+
    1 row in set (0.00 sec)

    MariaDB [vibes_dev]> UPDATE users set username='demo', encrypted_password='$2b$12$l2bhoLnGJkP50C0yJxKAzeld1Ew2ek5ptF.w9ooaAsItFHt3FN4ni' WHERE id = 1;
    Query OK, 1 row affected (0.01 sec)
    Rows matched: 1  Changed: 1  Warnings: 0

    MariaDB [vibes_dev]> select id, username, encrypted_password from users;
    +----+----------+--------------------------------------------------------------+
    | id | username | encrypted_password                                           |
    +----+----------+--------------------------------------------------------------+
    |  1 | demo     | $2b$12$o9jh6nTtVWwPkHPezdmFV.Wew/Qq8cZ0k21fmxpIz.pt7Pf2bMj8q |
    +----+----------+--------------------------------------------------------------+
    1 row in set (0.00 sec)

