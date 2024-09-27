import { Knex } from "knex";

const TABLE_NAME = "cart";

/**
 * Create table cart.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(TABLE_NAME, (table) => {
    table.bigIncrements(); // ID column for the cart entry

    table
      .bigInteger("user_id") // Reference to the user
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users") // Assuming you have a users table
      .onDelete("CASCADE"); // Optional: delete cart if user is deleted

    table
      .bigInteger("product_id") // Reference to the product
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("products") // Assuming you have a products table
      .onDelete("CASCADE"); // Optional: remove cart item if product is deleted
    table.integer("quantity").notNullable().defaultTo(1);
    table.timestamp("created_at").notNullable().defaultTo(knex.raw("now()"));
    table
      .bigInteger("created_by") // User who created the entry
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users"); // Reference to the users table for the creator

    table.timestamp("updated_at").nullable(); // Timestamp for last update
    table
      .bigInteger("updated_by") // User who updated the entry
      .unsigned()
      .references("id")
      .inTable("users")
      .nullable();
  });
}

/**
 * Drop table cart.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(TABLE_NAME);
}
