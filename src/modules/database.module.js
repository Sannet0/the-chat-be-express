const pgp = require("pg-promise")();
const cn = {
  host: 'localhost',
  port: 5432,
  database: 'the-chat',
  user: 'postgres',
  password: 'postgres'
};

module.exports = pgp(cn);
