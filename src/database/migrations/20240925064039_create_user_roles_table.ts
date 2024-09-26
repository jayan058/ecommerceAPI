import { Knex } from 'knex';

const USER_ROLES_TABLE = 'user_roles';
const USERS_TABLE = 'users';
const ROLES_TABLE = 'roles';

/**
 * Create user_roles table.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(USER_ROLES_TABLE, (table) => {
    table.bigIncrements('id'); // Primary key
    table.bigInteger('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable(USERS_TABLE)
      .onDelete('CASCADE'); // Foreign key referencing users
    table.bigInteger('role_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable(ROLES_TABLE)
      .onDelete('CASCADE'); // Foreign key referencing roles
  });
}

/**
 * Drop user_roles table.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(USER_ROLES_TABLE);
}
