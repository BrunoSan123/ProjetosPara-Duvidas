const { existOrError } = require("./utils/validator");
const knex = require("../config/db");
const queries = require("./utils/queries");

const saveArticles = (req, res) => {
  const artcle = { ...req.body };
  if (req.params.id) artcle.id = req.params.id;

  try {
    existOrError(artcle.name, "Nome da Categoria não informada");
    existOrError(artcle.description, "Descrição Não fornecida");
    existOrError(artcle.categoriesId, "Categoria não informada");
    existOrError(artcle.userId, "Autor não informado");
    existOrError(artcle.content, "Conteudo não informado");
  } catch (msg) {
    res.status(400).send(msg);
  }

  if (artcle.id) {
    knex("articles")
      .update(artcle)
      .where({ id: artcle.id })
      .then((_) => res.status(204).send())
      .catch((err) => res.status(500).send(err));
  } else {
    knex("articles")
      .insert(artcle)
      .then((_) => res.status(204).send())
      .catch((err) => res.status(500).send(err));
  }
};

const removeArticles = async (req, res) => {
  try {
    const rowsDeleted = await knex("articles")
      .where({ id: req.params.id })
      .del();
    ExistOrError(rowsDeleted, "Artigo não foi encontrado");

    res.status(204).send();
  } catch (msg) {
    res.status(500).send(msg);
  }
};

const limits = 10; // para páginação

const getArticles = async (req, res) => {
  const page = req.query.page || 1;

  const result = await knex("articles").count("id").first();
  const count = parseInt(result.count);

  knex("articles")
    .select("id", "name", "description")
    .limit(limits)
    .offset(page * limits - limits)
    .then((articles) => res.json({ data: articles, count, limits }))
    .catch((err) => res.status(500).send(err));
};

const getArticlesById = (req, res) => {
  knex("articles")
    .where({ id: req.params.id })
    .first()
    .then((article) => {
      article.content = article.content.toString();
      return res.json(article);
    })
    .catch((err) => res.status(500).send(err));
};

const getArticlesByCategory = async (req, res) => {
  const page = req.query.page || 1;
  const categories = await knex.raw(
    queries.categoryWithChildren,
    req.params.id
  );
  const ids = categories.rows.map((c) => c.id);

  knex({ a: "articles", u: "users" })
    .select("a.id", "a.name", "a.description", "a.imageUrl", {
      author: "u.name",
    })
    .limit(limits)
    .offset(page * limits - limits)
    .whereRaw("?? = ??", ["u.id", "a.userId"])
    .whereIn("categoriesId", ids)
    .orderBy("a.id", "desc")
    .then((articles) => res.json(articles))
    .catch((err) => res.status(500).send(err));
};

module.exports = {
  saveArticles,
  removeArticles,
  getArticles,
  getArticlesById,
  getArticlesByCategory,
};
