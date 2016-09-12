const express = require('express');
const router  = express.Router();


const authentications = require("../controllers/authentications");
const statics         = require("../controllers/statics");
const restaurants     = require("../controllers/restaurants");


//index html
router.route("/")
  .get(statics.home);
//user routes
router.route("/register")
  .post(authentications.register);
router.route("/login")
  .post(authentications.login);

//restaurant routes
router.route("/restaurants")
  .get(restaurants.index)
  .post(restaurants.create);
router.route("/restaurants/:id")
  .get(restaurants.show)
  .put(restaurants.update)
  .delete(restaurants.delete);

module.exports = router;
