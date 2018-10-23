# Tanzanite - Vibe Example interface code

A collection of examples detailing how to implement Vibe Gen3 functionality.

# Topaz Auth / React Implementation

Gen3 architecture implements a JWT token authentication and authorization scheme.  This example includes a working barebones authentication-protected React application that connects to Topaz's Auth functionality and persists authentication state via [Store.js](https://github.com/marcuswestin/store.js/), localStorage for most browsers.


## Setup Topaz (Auth Server)

  [Install docker](https://www.docker.com/get-started)

Clone the [Topaz](https://github.com/iCentris/vibes) repo 


    git clone https://github.com/iCentris/vibes.git
    cd vibes 

Build the docker container, takes a few minutes the first time

    ./local build fullstack

Start container and Topaz on http://localhost:4000

    ./local up fullstack

If this is your first time running Topaz or you want to start with a fresh db state...

Open a new terminal and shell into the container:
   
    ./local run-sh fullstack /bin/bash

Now reset the db:

    mix ecto.reset
  
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
    |  1 | andy     | $2b$12$3o8NRU6ngqRT8KZ.dlr2r.Oq4vLj3pwTrrpCNOO2yg9pWWRKX44vO |
    +----+----------+--------------------------------------------------------------+
    1 row in set (0.00 sec)

    MariaDB [vibes_dev]> UPDATE users set username='demo', encrypted_password='$2b$12$o9jh6nTtVWwPkHPezdmFV.Wew/Qq8cZ0k21fmxpIz.pt7Pf2bMj8q' WHERE id = 1;
    Query OK, 1 row affected (0.01 sec)
    Rows matched: 1  Changed: 1  Warnings: 0

    MariaDB [vibes_dev]> select id, username, encrypted_password from users;
    +----+----------+--------------------------------------------------------------+
    | id | username | encrypted_password                                           |
    +----+----------+--------------------------------------------------------------+
    |  1 | demo     | $2b$12$o9jh6nTtVWwPkHPezdmFV.Wew/Qq8cZ0k21fmxpIz.pt7Pf2bMj8q |
    +----+----------+--------------------------------------------------------------+
    1 row in set (0.00 sec)


## Setup Tanzanite React Demo Frontend

Install latest [Node.js](https://nodejs.org/en/) (11.0.0 currently)

Clone the Tanzanite repo

    git clone https://github.com/iCentris/tanzanite.git
    cd tanzanite

Install npm dependencies:

    npm install

Start the tanzanite server on `localhost:3000`

    npm start

Now open browser to http://localhost:3000 and you're all set!
