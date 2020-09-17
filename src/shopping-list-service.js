const ShoppingListService = {
    getAllGroceries(knex) {
        return knex.select('*').from('shopping_list')
    },
        getById(knex, id) {
            return knex
            .from('shopping_list')
            .select('*')
            .where('id', id)
            .first()
        },
        insertGrocery(knex, newGrocery) {         
            return knex
            .insert(newGrocery)
            .into('shopping_list')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
        },
        deleteGrocery(knex, id) {
            return knex('shopping_list')
                .where({ id })
                .delete()
        },
        updateGrocery(knex, id, newGroceryFields) {
            return knex('shopping_list')
                .where({ id })
                .update(newGroceryFields)
        },
}

module.exports = ShoppingListService