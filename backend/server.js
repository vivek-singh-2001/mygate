const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });



const app = require("./app");

console.log(app.get('env'))
console.log(process.env)

const connection = require("./models/connection");

// connection to database
connection.check();

const port = process.env.PORT || 7500;

app.listen(port, () => {
  console.log(`server is listening on ${port}`);
});
