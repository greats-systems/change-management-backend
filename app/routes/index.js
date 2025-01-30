module.exports = (app) => {
    const controller = require('../controllers/index.js')
    var router = require('express').Router()

    // User functions
    router.post('/user/create', controller.createUser)
    router.get('/users', controller.getUsers)
    router.get('/users/:accountNumber', controller.getUser)
    router.put('/users/:accountNumber/update', controller.updateUser)
    router.post('/users/:accountNumber/request-transaction', controller.requestTransaction)
    router.get('/users/:accountNumber/transactions', controller.getTransactions)
    router.get('/users/:accountNumber/balance', controller.getBalance)
    router.get('/retailers/:retailerName/locations', controller.getRetailerLocations)
    router.delete('users/:accountNumber/delete', controller.deleteUser)

    // Retailer functions
    router.post('retailers/:retailerName/create', controller.createRetailer)
    router.get('/retailers', controller.getRetailers)
    router.get('retailers/:retailerName', controller.getRetailer)
    router.put('retailers/:retailerName/update', controller.updateRetailer)
    router.put('/:accountNumber/process-transaction', controller.processTransaction)
    router.delete('retailers/:retailerName/delete', controller.deleteRetailer)

    app.use('/api', router)
}