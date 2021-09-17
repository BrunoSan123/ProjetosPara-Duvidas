const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const consign = require("consign");
const db = require("./config/db");
const routes = require("./config/routes");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("./swagger.json");

app.use(cors({ origin: true }));
app.use("/api-documentation", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//app.db=db
app.use(bodyParser.json());
app.use("/v1", routes);

//caso precise refatorar futuramente para o cosign de novo

/* consign()
    .then('./config/middlewares.js')
    .then('./api/validator.js')
    .then('./api/user.js')
    .then('./api/userTest.js')
    .then('./config/routes.js')
    .into(app)*/

module.exports = app;
