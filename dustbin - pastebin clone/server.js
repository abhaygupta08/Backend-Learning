const express = require("express");
const app = express();
const routes = require("./routes");
require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use("views", express.static("views"));

app.use("/", routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, (err) => {
  if (err) console.log(`[ FAIL ] : ${err}`);
  console.log(`[ SUCCESS ] : App Running on port ${PORT}`);
});
