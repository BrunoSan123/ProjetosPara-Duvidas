const bcrypt = require("bcrypt-nodejs");
const faker = require("faker/locale/pt_BR");
const sault = bcrypt.genSaltSync(10);

exports.seed = function (knex) {
  const createFakerUser = () => ({
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: bcrypt.hashSync(faker.internet.password(), sault),
    admin: faker.datatype.boolean(),
  });

  const fakeUsers = [];
  const fakersDesejados = 50;
  for (let i = 0; i < fakersDesejados; i++) {
    fakeUsers.push(createFakerUser());
  }
  // Deletes ALL existing entries

  // Inserts seed entries

  return knex("users").insert(fakeUsers);
};
