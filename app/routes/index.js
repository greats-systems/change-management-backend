module.exports = (app) => {
    const controller = require('../controllers/index.js')
    var router = require('express').Router()

    // Credential validation routes
    router.post('/credentials/create', controller.createCredentials)
    router.get('/credentials', controller.getPhoneCredential)

    // User routes
    router.post('/user/create', controller.createUser)
    router.get('/users', controller.getUsers)
    router.get('/users/:accountNumber', controller.getUser)
    router.put('/users/:accountNumber/update', controller.updateUser)
    router.post('/users/:accountNumber/request-transaction', controller.requestTransaction)
    router.get('/transactions/user', controller.getTransactionsForUser)
    router.get('/transactions/retailer/user', controller.getRetailerTransactionsForUser)
    router.get('/users/:accountNumber/credit/sum', controller.sumCredit)
    router.get('/users/:accountNumber/debit/sum', controller.sumDebit)
    router.get('/users/:accountNumber/credit/max', controller.maxCredit)
    router.get('/users/:accountNumber/debit/max', controller.maxDebit)
    router.get('/transactions', controller.getTransactions)
    router.get('/transactions/pending', controller.getPendingTransactions)
    router.get('/transactions/pending/check', controller.checkPendingTransactions)
    router.get('/users/:accountNumber/balance', controller.getBalance)
    router.get('/retailers/:retailerName/locations', controller.getRetailerLocations)
    router.delete('/users/:accountNumber/delete', controller.deleteUser)

    // Retailer routes
    router.post('/retailers/:retailerName/create', controller.createRetailer)
    router.get('/retailers', controller.getRetailers)
    router.get('/retailers/:retailerName', controller.getRetailer)
    router.get('/transactions/pending', controller.getPendingTransactions)
    router.get('/retailers/:retailerName/credit/sum', controller.sumCredit)
    router.get('/retailers/:retailerName/debit/sum', controller.sumDebit)
    router.get('/retailers/:retailerName/credit/max', controller.maxCredit)
    router.get('/retailers/:retailerName/debit/max', controller.maxDebit)
    router.put('/retailers/:retailerName/update', controller.updateRetailer)
    router.get('/transactions/:retailerName', controller.getTransactionsForRetailer)
    router.put('/transactions/process', controller.processTransaction)
    router.delete('/retailers/:retailerName/delete', controller.deleteRetailer)

    // Data analysis routes

    app.use('/api', router)
}