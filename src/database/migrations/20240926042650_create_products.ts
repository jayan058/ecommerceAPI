import { Knex } from 'knex';

const TABLE_NAME = 'products';

/**
 * Create table products.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(TABLE_NAME, (table) => {
    table.bigIncrements(); // ID column
    table.string('name').notNullable(); // Product name
    table.string('brand'); // Brand name
    table.string('category'); // Product category
    table.decimal('price', 10, 2).notNullable(); // Price with two decimal places
    table.integer('inventory_count').notNullable(); // Inventory count
    table.text('description');
    table.boolean('is_active').notNullable().defaultTo(true); // Indicates if the product is active   
    table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()')); ;
    table.timestamp('updated_at').defaultTo(knex.fn.now());
 
  });
}

/**
 * Drop table products.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(TABLE_NAME);
}
