import { Knex } from 'knex';

const PERMISSIONS_TABLE = 'permissions';

/**
 * Create permissions table.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(PERMISSIONS_TABLE, (table) => {
    table.bigIncrements('id'); // Primary key
    table.string('name', 50).notNullable().unique(); // Permission name
    table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
    table.timestamp('updated_at').nullable();
  });
}

/**
 * Drop permissions table.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(PERMISSIONS_TABLE);
}
