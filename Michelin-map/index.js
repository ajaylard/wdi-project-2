const express    = require("express");
const morgan     = require("morgan");
const bodyParser = require("body-parser");
const mongoose   = require("mongoose");
const cors       = require("cors");
const path       = require("path");

const app        = express();
const config     = require("./config/config");
const router     = require("./config/routes");

mongoose.connect(config.db);

app.use(morgan("dev"));
app.use(express.static(`${__dirname}/public`));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use("/", router);
app.use("/api", router);

app.listen(config.port, () => console.log(`Express started on port: ${config.port}`));
