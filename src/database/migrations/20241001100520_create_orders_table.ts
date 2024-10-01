import { Knex } from "knex";

const TABLE_NAME = "orders";

/**
 * Create table orders.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(TABLE_NAME, (table) => {
    table.bigIncrements(); // ID column for the order
    table
      .bigInteger("user_id") // Reference to the user
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users") // Assuming you have a users table
      .onDelete("CASCADE"); // Optional: delete orders if user is deleted
    table
      .bigInteger("product_id") // Reference to the product
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("products") // Assuming you have a products table
      .onDelete("CASCADE"); // Optional: remove order if product is deleted
    table.decimal("total_amount", 14, 2).notNullable(); // Total amount for the order
    table.integer("quantity").notNullable().defaultTo(1); // Quantity of the product ordered
    table.timestamp("created_at").notNullable().defaultTo(knex.raw("now()")); // Timestamp for order creation
    table.timestamp("updated_at").nullable(); // Timestamp for last update
  });
}

/**
 * Drop table orders.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(TABLE_NAME);
}
