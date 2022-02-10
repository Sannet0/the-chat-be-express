const db = require('../modules/database.module');
const passwordHash = require('password-hash');
const jwt = require("jsonwebtoken");

const registration = async (req, res) => {
  const { login, password, repPassword } = req.body;

  try {
    if (password !== repPassword) {
      throw { message: 'passwords are not same', statusCode: 400 };
    }

    const hash = passwordHash.generate(password);

    const createdUser = await db.any(`
      INSERT INTO Users ("login", "password") 
      VALUES ('${ login }', '${ hash }') 
      RETURNING id, "login"
    `);
    const newUser = createdUser[0];

    if (newUser === undefined) {
      throw { message: 'bad request', statusCode: 400 };
    }

    const payload = { id: newUser.id, login: newUser.login };

    return res.send({
      jwt: jwt.sign(payload, process.env.SECRET, { expiresIn: '24h' })
    });
  } catch (err) {
    return res.status(err.statusCode || 400).send(err.message || 'something  wrong');
  }
}

const login = async (req, res) => {
  const { login, password } = req.body;
  try {
    const user = await db.any(`
      SELECT * FROM Users
      WHERE "login" = '${ login }'
    `);

    const accurateUser = user[0];

    if (accurateUser === undefined) {
      throw { message: 'no such user', statusCode: 400 };
    }

    const isPasswordCorrect = passwordHash.verify(password, accurateUser.password);

    if(!isPasswordCorrect) {
      throw { message: 'username or password are not correct', statusCode: 403 };
    }

    const payload = { id: accurateUser.id, login: accurateUser.login };

    return res.send({
      jwt: jwt.sign(payload, process.env.SECRET, { expiresIn: '24h' })
    });
  } catch (err) {
    return res.status(err.statusCode || 400).send(err.message || 'something  wrong');
  }
}

const userInfo = (req, res) => {
  const { id, login } = req.user;
  res.send({ id, login });
}

module.exports = {
  registration,
  login,
  userInfo
}
