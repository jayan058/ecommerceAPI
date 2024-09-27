import { Knex } from "knex";

const USERS_TABLE = "users";

/**
 * Create users table.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(USERS_TABLE, (table) => {
    table.bigIncrements("id"); // Primary key
    table.string("username", 50).notNullable(); // Username
    table.string("email", 100).notNullable(); // Email
    table.string("password", 255).notNullable(); // Password
    table.timestamp("created_at").notNullable().defaultTo(knex.raw("now()")); // Created timestamp
    table.timestamp("updated_at").nullable(); // Updated timestamp
  });
}

/**
 * Drop users table.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(USERS_TABLE);
}
