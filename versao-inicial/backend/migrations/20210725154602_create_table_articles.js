exports.up = function (knex) {
  return knex.schema.createTable("articles", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("description", 1000).notNullable();
    table.string("imageUrl", 1000);
    table.binary("content").notNullable();
    table.integer("userId").references("id").inTable("users").notNullable();
    table
      .integer("categoriesId")
      .references("id")
      .inTable("categories")
      .notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("articles");
};
