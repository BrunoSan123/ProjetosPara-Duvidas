const express = require("express");
const routes = express.Router();
const { save, get, getById } = require("../api/user");
const {
  saveCategory,
  removeCategory,
  getCategory,
  getCategoryById,
  getTree,
} = require("../api/category");
const {
  saveArticles,
  removeArticles,
  getArticles,
  getArticlesById,
  getArticlesByCategory,
} = require("../api/articles");
const { signin, validateToken } = require("../api/utils/auth");
const { authenticate } = require("./passport");
const admin =require('./admin')

try {
  routes.post("/signup", save);
  routes.post("/signin", signin);
  routes.post("/validateToken", validateToken);

  routes
    .route("/users")
    .all(authenticate())
    .post(admin(save))
    .get(get);

  routes
    .route("/users/:id")
    .all(authenticate())
    .get(getById)
    .put(admin(save));

  routes
    .route("/categories")
    .all(authenticate())
    .get(getCategory)
    .post(saveCategory);

  // Rota tree deve vir antes de categories/id

  routes
    .route("/categories/tree")
    .all(authenticate())
    .get(getTree);

  routes
    .route("/categories/:id")
    .all(authenticate())
    .get(getCategoryById)
    .put(admin(saveCategory))
    .delete(admin(removeCategory));

  routes
    .route("/articles")
    .all(authenticate())
    .get(getArticles)
    .post(admin(saveArticles));

  routes
    .route("/articles/:id")
    .all(authenticate())
    .get(getArticlesById)
    .put(admin(saveArticles))
    .delete(admin(removeArticles));

  routes
    .route("/categories/:id/articles")
    .all(authenticate())
    .get(getArticlesByCategory);
} catch (error) {
  console.error(error);
}

module.exports = routes;

//refatoração para o cosign futuramente

/*module.exports = app =>{
    app.route('/users')
        .post(app.api.user.save)
        .get(app.api.user.get)
    app.route('/userTest').post(app.api.userTest.post)    
    
    app.route('/users/:id')
        .put(app.api.user.save)
        //.get(app.api.user.getById)
}*/
