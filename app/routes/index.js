module.exports = (app) => {
  const controller = require("../controllers/index.js");
  var router = require("express").Router();

  // Root
  /**
   * @swagger
   * /:
   *   get:
   *     summary: Entry point of the application
   *     description: Returns a welcome message
   *     responses:
   *       200:
   *         description: A welcome message
   *         content:
   *           text/plain:
   *             schema:
   *               type: string
   *               example: Welcome to change-management-backend
   */
  router.get("/", controller.root);

  // Credential validation routes
  /**
   * @swagger
   * /credentials/create:
   *   post:
   *     summary: Create new credentials
   *     description: Add a new phone number credential to the database
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - phoneNumber
   *             properties:
   *               phoneNumber:
   *                 type: string
   *                 description: The phone number to register
   *                 example: "+1234567890"
   *     responses:
   *       201:
   *         description: Credential created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 phoneNumber:
   *                   type: string
   *                   example: "+1234567890"
   *       500:
   *         description: Internal server error
   */
  router.post("/credentials/create", controller.createCredentials);

  /**
   * @swagger
   * /credentials:
   *   get:
   *     summary: Get phone credential
   *     description: Retrieve a phone credential by phone number
   *     parameters:
   *       - in: query
   *         name: phoneNumber
   *         schema:
   *           type: string
   *         required: true
   *         description: The phone number to search for
   *     responses:
   *       200:
   *         description: Credential retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 phoneNumber:
   *                   type: string
   *                   example: "+1234567890"
   *       404:
   *         description: Credential not found
   *       500:
   *         description: Internal server error
   */
  router.get("/credentials", controller.getPhoneCredential);

  // User routes
  /**
   * @swagger
   * tags:
   *   - name: Users
   *     description: User management
   *   - name: Transactions
   *     description: Transaction operations
   *   - name: Retailers
   *     description: Retailer information
   */

  /**
   * @swagger
   * /user/create:
   *   post:
   *     tags: [Users]
   *     summary: Create a new user
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - firstName
   *               - lastName
   *               - accountNumber
   *               - username
   *               - PIN
   *             properties:
   *               firstName:
   *                 type: string
   *               lastName:
   *                 type: string
   *               accountNumber:
   *                 type: string
   *               username:
   *                 type: string
   *               PIN:
   *                 type: string
   *     responses:
   *       201:
   *         description: User created successfully
   *       500:
   *         description: Internal server error
   */
  router.post("/user/create", controller.createUser);

  /**
   * @swagger
   * /users:
   *   get:
   *     tags: [Users]
   *     summary: Get all users
   *     responses:
   *       200:
   *         description: List of all users
   *       404:
   *         description: No users found
   *       500:
   *         description: Internal server error
   */
  router.get("/users", controller.getUsers);

  /**
   * @swagger
   * /users/{accountNumber}:
   *   get:
   *     tags: [Users]
   *     summary: Get a specific user by account number
   *     parameters:
   *       - in: path
   *         name: accountNumber
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: User details
   *       404:
   *         description: User not found
   *       500:
   *         description: Internal server error
   */
  router.get("/users/:accountNumber", controller.getUser);

  /**
   * @swagger
   * /users/{accountNumber}/update:
   *   put:
   *     tags: [Users]
   *     summary: Update user information
   *     parameters:
   *       - in: path
   *         name: accountNumber
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               firstName:
   *                 type: string
   *               lastName:
   *                 type: string
   *               PIN:
   *                 type: string
   *     responses:
   *       200:
   *         description: User updated successfully
   *       500:
   *         description: Internal server error
   */
  router.put("/users/:accountNumber/update", controller.updateUser);

  /**
   * @swagger
   * /users/{accountNumber}/request-transaction:
   *   post:
   *     tags: [Transactions]
   *     summary: Request a new transaction
   *     parameters:
   *       - in: path
   *         name: accountNumber
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             oneOf:
   *               - $ref: '#/components/schemas/CreditTransaction'
   *               - $ref: '#/components/schemas/DebitTransaction'
   *     responses:
   *       202:
   *         description: Transaction request pending approval
   *       500:
   *         description: Internal server error
   */
  router.post(
    "/users/:accountNumber/request-transaction",
    controller.requestTransaction
  );

  /**
   * @swagger
   * /transactions/user:
   *   get:
   *     tags: [Transactions]
   *     summary: Get transactions for a user
   *     parameters:
   *       - in: query
   *         name: accountNumber
   *         required: true
   *         schema:
   *           type: string
   *       - in: query
   *         name: issuedBy
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: List of user transactions
   *       500:
   *         description: Internal server error
   */
  router.get("/transactions/user", controller.getTransactionsForUser);

  /**
   * @swagger
   * /transactions/retailer/user:
   *   get:
   *     tags: [Transactions]
   *     summary: Get retailer transactions for a user
   *     parameters:
   *       - in: query
   *         name: accountNumber
   *         required: true
   *         schema:
   *           type: string
   *       - in: query
   *         name: issuedBy
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: List of retailer transactions for user
   *       500:
   *         description: Internal server error
   */
  router.get(
    "/transactions/retailer/user",
    controller.getRetailerTransactionsForUser
  );

  /**
   * @swagger
   * /users/{accountNumber}/balance:
   *   get:
   *     tags: [Users]
   *     summary: Get user balance
   *     parameters:
   *       - in: path
   *         name: accountNumber
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Current balance
   *       500:
   *         description: Internal server error
   */
  router.get("/users/:accountNumber/balance", controller.getBalance);

  /**
   * @swagger
   * /transactions:
   *   get:
   *     tags: [Transactions]
   *     summary: Get all transactions for an account
   *     parameters:
   *       - in: query
   *         name: accountNumber
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: List of all transactions
   *       500:
   *         description: Internal server error
   */
  router.get("/transactions", controller.getTransactions);

  /**
   * @swagger
   * /transactions/pending:
   *   get:
   *     tags: [Transactions]
   *     summary: Get all pending transactions
   *     responses:
   *       200:
   *         description: List of pending transactions
   *       500:
   *         description: Internal server error
   */
  router.get("/transactions/pending", controller.getPendingTransactions);

  /**
   * @swagger
   * /transactions/pending/check:
   *   get:
   *     tags: [Transactions]
   *     summary: Check pending transactions for an account
   *     parameters:
   *       - in: query
   *         name: accountNumber
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: List of pending transactions for account
   *       500:
   *         description: Internal server error
   */
  router.get(
    "/transactions/pending/check",
    controller.checkPendingTransactions
  );

  /**
   * @swagger
   * /retailers/{retailerName}/locations:
   *   get:
   *     tags: [Retailers]
   *     summary: Get retailer locations
   *     parameters:
   *       - in: path
   *         name: retailerName
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: List of retailer locations
   *       500:
   *         description: Internal server error
   */
  router.get(
    "/retailers/:retailerName/locations",
    controller.getRetailerLocations
  );

  /**
   * @swagger
   * /users/{accountNumber}/delete:
   *   delete:
   *     tags: [Users]
   *     summary: Delete a user
   *     parameters:
   *       - in: path
   *         name: accountNumber
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: User deleted successfully
   *       500:
   *         description: Internal server error
   */
  router.delete("/users/:accountNumber/delete", controller.deleteUser);

  // Add these components to your swagger definition (in swagger.js)
  /**
   * @swagger
   * components:
   *   schemas:
   *     CreditTransaction:
   *       type: object
   *       properties:
   *         creditDebit:
   *           type: string
   *           enum: [credit]
   *         description:
   *           type: string
   *         balance:
   *           type: number
   *     DebitTransaction:
   *       type: object
   *       properties:
   *         creditDebit:
   *           type: string
   *           enum: [debit]
   *         username:
   *           type: string
   *         description:
   *           type: string
   *         amount:
   *           type: number
   *         issuedBy:
   *           type: string
   *         balance:
   *           type: number
   */

  // Retailer routes
  /**
   * @swagger
   * /retailers/{retailerName}/create:
   *   post:
   *     tags: [Retailers]
   *     summary: Create a new retailer
   *     parameters:
   *       - in: path
   *         name: retailerName
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Retailer'
   *     responses:
   *       201:
   *         description: Retailer created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Retailer'
   *       500:
   *         description: Internal server error
   */
  router.post("/retailers/:retailerName/create", controller.createRetailer);

  /**
   * @swagger
   * /retailers:
   *   get:
   *     tags: [Retailers]
   *     summary: Get all retailers
   *     responses:
   *       200:
   *         description: List of all retailers
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Retailer'
   *       500:
   *         description: Internal server error
   */
  router.get("/retailers", controller.getRetailers);

  /**
   * @swagger
   * /retailers/{retailerName}:
   *   get:
   *     tags: [Retailers]
   *     summary: Get a specific retailer by name
   *     parameters:
   *       - in: path
   *         name: retailerName
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Retailer details
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Retailer'
   *       500:
   *         description: Internal server error
   */
  router.get("/retailers/:retailerName", controller.getRetailer);

  /**
   * @swagger
   * /retailers/{retailerName}/credit/sum:
   *   get:
   *     tags: [Retailers]
   *     summary: Get sum of credit transactions for a retailer
   *     parameters:
   *       - in: path
   *         name: retailerName
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Sum of credit transactions
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 sum:
   *                   type: number
   *       500:
   *         description: Internal server error
   */
  router.get("/retailers/:retailerName/credit/sum", controller.sumCredit);

  /**
   * @swagger
   * /retailers/{retailerName}/debit/sum:
   *   get:
   *     tags: [Retailers]
   *     summary: Get sum of debit transactions for a retailer
   *     parameters:
   *       - in: path
   *         name: retailerName
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Sum of debit transactions
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 sum:
   *                   type: number
   *       500:
   *         description: Internal server error
   */
  router.get("/retailers/:retailerName/debit/sum", controller.sumDebit);

  /**
   * @swagger
   * /retailers/{retailerName}/credit/max:
   *   get:
   *     tags: [Retailers]
   *     summary: Get maximum credit transaction for a retailer
   *     parameters:
   *       - in: path
   *         name: retailerName
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Maximum credit transaction
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 max:
   *                   type: number
   *       500:
   *         description: Internal server error
   */
  router.get("/retailers/:retailerName/credit/max", controller.maxCredit);

  /**
   * @swagger
   * /retailers/{retailerName}/debit/max:
   *   get:
   *     tags: [Retailers]
   *     summary: Get maximum debit transaction for a retailer
   *     parameters:
   *       - in: path
   *         name: retailerName
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Maximum debit transaction
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 max:
   *                   type: number
   *       500:
   *         description: Internal server error
   */
  router.get("/retailers/:retailerName/debit/max", controller.maxDebit);

  /**
   * @swagger
   * /retailers/{retailerName}/update:
   *   put:
   *     tags: [Retailers]
   *     summary: Update retailer information
   *     parameters:
   *       - in: path
   *         name: retailerName
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               retailerLocation:
   *                 type: string
   *     responses:
   *       200:
   *         description: Retailer updated successfully
   *       500:
   *         description: Internal server error
   */
  router.put("/retailers/:retailerName/update", controller.updateRetailer);

  /**
   * @swagger
   * /transactions/{retailerName}:
   *   get:
   *     tags: [Retailers]
   *     summary: Get transactions for a specific retailer
   *     parameters:
   *       - in: path
   *         name: retailerName
   *         required: true
   *         schema:
   *           type: string
   *       - in: query
   *         name: issuedBy
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: List of transactions for the retailer
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Transaction'
   *       500:
   *         description: Internal server error
   */
  router.get(
    "/transactions/:retailerName",
    controller.getTransactionsForRetailer
  );

  /**
   * @swagger
   * /transactions/process:
   *   put:
   *     tags: [Retailers]
   *     summary: Process a transaction
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ProcessTransaction'
   *     responses:
   *       200:
   *         description: Transaction processed successfully
   *       400:
   *         description: Insufficient funds
   *       500:
   *         description: Internal server error
   */
  router.put("/transactions/process", controller.processTransaction);

  /**
   * @swagger
   * /retailers/{retailerName}/delete:
   *   delete:
   *     tags: [Retailers]
   *     summary: Delete a retailer
   *     parameters:
   *       - in: path
   *         name: retailerName
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Retailer deleted successfully
   *       500:
   *         description: Internal server error
   */
  router.delete("/retailers/:retailerName/delete", controller.deleteRetailer);

  /**
   * @swagger
   * components:
   *   schemas:
   *     Retailer:
   *       type: object
   *       properties:
   *         retailerName:
   *           type: string
   *         retailerAddress:
   *           type: string
   *         retailerLocation:
   *           type: string
   *       required:
   *         - retailerName
   *         - retailerAddress
   *     ProcessTransaction:
   *       type: object
   *       properties:
   *         creditDebit:
   *           type: string
   *           enum: [credit, debit]
   *         oldBalance:
   *           type: number
   *         amount:
   *           type: number
   *         cashBackAmount:
   *           type: number
   *         uuid:
   *           type: string
   *         issuedBy:
   *           type: string
   *       required:
   *         - creditDebit
   *         - oldBalance
   *         - amount
   *         - uuid
   */

  // Data analysis routes

  app.use("/api", router);
};
