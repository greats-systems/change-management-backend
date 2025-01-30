const express = require("express");
const bodyParser = require("body-parser");
// const cors = require("cors");

const app = express();

app.use(bodyParser.json());
// app.use(cors())
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));


// set port, listen for requests
const PORT = process.env.PORT || 5000;
require("./app/routes/index.js")(app);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });