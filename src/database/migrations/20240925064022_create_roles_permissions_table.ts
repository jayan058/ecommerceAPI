import { Knex } from 'knex';

const ROLE_PERMISSIONS_TABLE = 'role_permissions';
const ROLES_TABLE = 'roles';
const PERMISSIONS_TABLE = 'permissions';

/**
 * Create role_permissions table.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(ROLE_PERMISSIONS_TABLE, (table) => {
    table.bigIncrements('id'); // Primary key
    table.bigInteger('role_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable(ROLES_TABLE)
      .onDelete('CASCADE'); // Foreign key referencing roles
    table.bigInteger('permission_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable(PERMISSIONS_TABLE)
      .onDelete('CASCADE'); // Foreign key referencing permissions
  });
}

/**
 * Drop role_permissions table.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(ROLE_PERMISSIONS_TABLE);
}
