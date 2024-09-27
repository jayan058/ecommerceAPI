import { Knex } from "knex";

const TABLE_NAME = "role_permissions";

/**
 * Delete existing entries and seed values for table TABLE_NAME.
 *
 * @param   {Knex} knex - The Knex instance for database operations.
 * @returns {Promise<void>} - A promise that resolves when seeding is complete.
 */
export function seed(knex: Knex): Promise<void> {
  return knex(TABLE_NAME)
    .del() // Delete existing entries
    .then(() => {
      return knex(TABLE_NAME).insert([
        {
          permission_id: 1, // Permission ID 1
          role_id: 2, // Admin role
        },
        {
          permission_id: 2, // Permission ID 2
          role_id: 2, // Admin role
        },
        {
          permission_id: 3, // Permission ID 3
          role_id: 2, // Admin role
        },
        {
          permission_id: 4, // Permission ID 4
          role_id: 2, // Admin role
        },
        // User role (role_id: 2) has limited permissions (5-8)
        {
          permission_id: 5, // Permission ID 5
          role_id: 2, // User role
        },
        {
          permission_id: 6, // Permission ID 6
          role_id: 1, // User role
        },
        {
          permission_id: 7, // Permission ID 7
          role_id: 1, // User role
        },
        {
          permission_id: 8, // Permission ID 8
          role_id: 1, // User role
        },
        {
          permission_id: 9, // Permission ID 8
          role_id: 1, // User role
        },
        {
          permission_id: 10, // Permission ID 8
          role_id: 1, // User role
        },
        {
          permission_id: 11, // Permission ID 8
          role_id: 1, // User role
        },
      ]);
    });
}
