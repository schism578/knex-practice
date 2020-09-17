const ShoppingListService = require('../src/shopping-list-service')
const knex = require('knex')

describe(`Shopping List Service object`, function() {
    let db
    let testGroceries = [
        {
            id: 1,
            name: 'Fish tricks',
            price: '13.10',
            date_added: new Date('2029-01-22T16:28:32.615Z'),
            category: 'Main', 
        },
        {
            id: 2,
            name: 'Not dogs',
            price: '4.99',
            date_added: new Date('2029-01-22T16:28:32.615Z'),
            category: 'Snack', 
        },
        {
            id: 3,
            name: 'SubstiTuna Salad',
            price: '1.24',
            date_added: new Date('2029-01-22T16:28:32.615Z'),
            category: 'Lunch', 
        },
        {
            id: 4,
            name: 'Tofurkey',
            price: '2.50',
            date_added: new Date('2029-01-22T16:28:32.615Z'),
            category: 'Breakfast', 
        },
    ]

    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
    })

    before(() => db('shopping_list').truncate())

    afterEach(() => db('shopping_list').truncate())
    
    after(() => db.destroy())

    context(`Given 'shopping_list' has data`, () => {
        beforeEach(() => {
            return db
                .into('shopping_list')
                .insert(testGroceries)
        })
        it(`getAllGroceries() resolves all articles from 'shopping_list' table`, () => {
            return ShoppingListService.getAllGroceries(db)
                .then(actual => {
                    expect(actual).to.eql(testGroceries.map(grocery => ({
                        ...grocery,
                        date_added: new Date(grocery.date_added)
                    })))
                })
        })
        it(`deleteGrocery() removes a grocery by id from 'shopping_list' table`, () => {
            const groceryId = 3
            return ShoppingListService.deleteGrocery(db, groceryId)
                .then(() => ShoppingListService.getAllGroceries(db))
                .then(allGroceries => {
                    const expected = testGroceries.filter(grocery => grocery.id !== groceryId)
                    expect(allGroceries).to.eql(expected)
                })
        })
        it(`updateGrocery() updates a grocery from the 'shopping_list' table`, () => {
            const idOfGroceryToUpdate = 3
            const newGroceryData = {
                name: 'updated name',
                price: 'updated price',
                date_added: new Date(),
                category: 'updated category',
            }
            return ShoppingListService.updateGrocery(db, idOfGroceryToUpdate, newGroceryData)
                .then(() => ShoppingListService.getById(db, idOfGroceryToUpdate))
                .then(grocery => {
                    expect(grocery).to.eql({
                    id: idOfGroceryToUpdate,
                    ...newGroceryData,
                    })
                })
        })
    })

    context(`Given 'shopping_list' has no data`, () => {
        it(`getAllGroceries() resolves an empty array`, () => {
            return ShoppingListService.getAllGroceries(db)
                .then(actual => {
                expect(actual).to.eql([])
            })
        })
        it(`insertGrocery() inserts a new grocery and resolves the new grocery with an 'id'`, () => {
            const newGrocery = {
                name: 'Test new name',
                price: 'Test new price',
                date_added: new Date('2020-01-01T00:00:00.000Z'),
                category: 'Test new category',
            }
                return ShoppingListService.insertGrocery(db, newGrocery)
                .then(actual => {
                    expect(actual).to.eql({
                        id: 1,
                        name: newGrocery.name,
                        price: newGrocery.price,
                        date_added: new Date(newGrocery.date_added),
                        category: newGrocery.category,                    
                    })
                })
        })
        it(`getById() resolves a grocery by id from 'shopping_list' table`, () => {
            const thirdId = 3
            const thirdTestGrocery = testGroceries[thirdId - 1]
                return ShoppingListService.getById(db, thirdId)
                    .then(actual => {
                        expect(actual).to.eql({
                            id: thirdId,
                            name: thirdTestGrocery.name,
                            price: thirdTestGrocery.price,
                            date_added: thirdTestGrocery.date_added,
                            category: thirdTestGrocery.category, 
                        })
                    })
                })
    })
})