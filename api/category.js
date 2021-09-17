const { existOrError, notExistOrError } = require("./utils/validator");
const knex = require("../config/db");

const saveCategory = (req, res) => {
  const category = { ...req.body };
  if (req.params.id) category.id = req.params.id;

  try {
    existOrError(category.name, "Nome não informado");
  } catch (mdg) {
    return res.status(400).send(msg);
  }

  if (category.id) {
    knex("categories")
      .update(category)
      .where({ id: category.id })
      .then((_) => res.status(204).send())
      .catch((err) => res.status(500).send(err));
  } else {
    knex("categories")
      .insert(category)
      .then((_) => res.status(204).send())
      .catch((err) => res.status(500).semd(err));
  }
};

const removeCategory = async (req, res) => {
  try {
    existOrError(req.params.id, "Codigo da categoria não informado");

    const subcategory = await knex("categories").where({
      parentId: req.params.id,
    });

    notExistOrError(subcategory, "Categoria possui subcategorias");

    const articles = await knex("articles").where({
      categoryId: req.params.id,
    });

    notExistOrError(articles, "Categoria possui artigos");

    const rowsDelete = await knex("categories")
      .where({ id: req.params.id })
      .del();
    existOrError(rowsDelete, "Categoria não foi encontrada");

    res.status(204).send;
  } catch (msg) {
    res.status(400).send(msg);
  }
};

const withPath = (categories) => {
  const getParent = (categories, parentId) => {
    const parent = categories.filter((parent) => parent.id === parentId);
    return parent.length ? parent[0] : null;
  };

  const categoriesWithPath = categories.map((category) => {
    let path = category.name;
    let parent = getParent(categories, category.parentId);

    while (parent) {
      path = `${parent.name}>${path}`;
      parent = getParent(categories, parent.parentId);
    }

    return { ...category, path };
  });

  categoriesWithPath.sort((a, b) => {
    if (a.path < b.path) return -1;
    if (a.path > b.path) return 1;
    return 0;
  });

  return categoriesWithPath;
};

const getCategory = (req, res) => {
  knex("categories")
    .then((categories) => res.json(withPath(categories)))
    .catch((err) => res.status(500).send(err));
};

const getCategoryById = (req, res) => {
  knex("categories")
    .where({ id: req.params.id })
    .first()
    .then((category) => res.json(category))
    .catch((err) => res.status(500).send(err));
};

const toTree = (categories, tree) => {
  if (!tree) tree = categories.filter((c) => !c.parentId);
  tree = tree.map((parentNode) => {
    const isChild = (node) => node.parentId == parentNode.id;
    parentNode.children = toTree(categories, categories.filter(isChild));
    return parentNode;
  });
  return tree;
};

const getTree = (req, res) => {
  knex("categories")
    .then((categories) => res.json(toTree(withPath(categories))))
    .catch((err) => res.status(500).send(err));
};

module.exports = {
  saveCategory,
  removeCategory,
  getCategory,
  getCategoryById,
  getTree,
};
