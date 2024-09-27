import { Knex } from "knex";

const ROLES_TABLE = "roles";

/**
 * Create roles table.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(ROLES_TABLE, (table) => {
    table.bigIncrements("id"); // Primary key
    table.string("name", 50).notNullable().unique(); // Role name
    table.timestamp("created_at").notNullable().defaultTo(knex.raw("now()"));
    table.timestamp("updated_at").nullable();
  });
}

/**
 * Drop roles table.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(ROLES_TABLE);
}
