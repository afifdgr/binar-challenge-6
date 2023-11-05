const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const route = require('./src/routes/routes');
dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

app.use(route);

app.get("/", (req, res) => {
  res.send("Ok")
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is up and listening at port: ${PORT}`);
});

module.exports = app;
