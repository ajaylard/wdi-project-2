const express    = require("express");
const morgan     = require("morgan");
const bodyParser = require("body-parser");
const mongoose   = require("mongoose");
const cors       = require("cors");
const path       = require("path");
const expressJWT = require("express-jwt");

const app        = express();
const config     = require("./config/config");
const router     = require("./config/routes");

mongoose.connect(config.db);

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use("/", router);
app.use("/api", router);
app.use(express.static(`${__dirname}/public`));

// app.use("/api", expressJWT({ secret: config.secret })
//   .unless({
//     path: [
//       { url: "/api/register", methods: ["POST"] },
//       { url: "/api/login",    methods: ["POST"] },
//     ]
//   }));
// app.use(jwtErrorHandler);

app.use("/api", router);

function jwtErrorHandler(err, req, res, next){
  if (err.name !== "UnauthorizedError") return next();
  return res.status(401).json({ message: "Unauthorized request." });
}

app.listen(config.port, () => console.log(`Express started on port: ${config.port}`));
