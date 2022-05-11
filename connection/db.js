const {Pool} = require ('pg')

const dbPool = new Pool ({
    database: 'batch34',
    port: 5432,
    user: 'postgres',
    password: 'kikim02'
})

module.exports = dbPool