const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app");
const connection = require("./models/connection");

// connection to database check
connection.check();

const port = process.env.PORT || 7500;

app.listen(port, () => {
  console.log(`server is listening on ${port}`);
});
