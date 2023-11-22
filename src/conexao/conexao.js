const knex = require('knex')({
  client: 'pg',
  connection: {
    host: process.env.HOST_BD,
    port: process.env.PORT_BD,
    user: process.env.USER_BD,
    password: process.env.PASSWORD_BD,
    database: process.env.DATABASE
  }
});

module.exports = knex;