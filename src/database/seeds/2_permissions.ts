import { Knex } from "knex";

const TABLE_NAME = "permissions";

/**
 * Delete existing entries and seed values for table TABLE_NAME.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex(TABLE_NAME).del();

  // Inserts seed entries
  await knex(TABLE_NAME).insert([
    { name: "add_to_cart" },
    { name: "remove_from_cart" },
    { name: "view_cart" },
    { name: "view_products" },
    { name: "search_products" },
    { name: "checkout" },
    { name: "add_products" },
    { name: "set_prices" },
    { name: "manage_inventory" },
    { name: "view_all_orders" },
    { name: "manage_users" },
  ]);
}
