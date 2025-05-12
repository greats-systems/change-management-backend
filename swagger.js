    const swaggerJSDoc = require("swagger-jsdoc");

    const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
    title: "My change management API",
    version: "1.0.0",
    description: "This is the backend for the change management project",
    },
    };

    const options = {
    swaggerDefinition,
    apis: ["./app/routes/*.js"], // Path to the API routes in your Node.js application
    };

    const swaggerSpec = swaggerJSDoc(options);
    module.exports = swaggerSpec;