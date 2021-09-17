const { authSecret } = require("./../../.env");
const jwt = require("jwt-simple");
const bcrypt = require("bcrypt-nodejs");
const knex = require("../../config/db");

const signin = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send("Informe usuario e senha!");
  }

  const user = await knex("users").where({ email: req.body.email }).first();
  if (!user) return res.status(400).send("Usuario não encontrado");

  const ismatch = bcrypt.compareSync(req.body.password, user.password);
  if (!ismatch) return res.status(401).send("Email/senha invalidos");

  const now = Math.floor(Date.now() / 1000);

  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
    admin: user.admin,
    iat: now,
    exp: now + (60 * 60 + 24 + 3),
  };

  res.json({
    ...payload,
    token: jwt.encode(payload, authSecret),
  });
};

const validateToken = async (req, res) => {
  const userData = req.body || null;

  try {
    if (userData) {
      const token = jwt.decode(userData.token, authSecret);
      if (new Date(token.exp * 100) > new Date()) {
        return res.send(true);
      }
    }
  } catch (e) {
    //problema no token
    res.send(false);
  }
};

module.exports = { signin, validateToken };
