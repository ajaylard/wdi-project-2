const express = require('express');
const router  = express.Router();


const authentications = require("../controllers/authentications");
const users           = require("../controllers/users");
const statics         = require("../controllers/statics");
const restaurants     = require("../controllers/restaurants");


router.route("/")
  .get(statics.home);

//user routes
router.route("/register")
  .post(authentications.register);
router.route("/login")
  .post(authentications.login);
router.route('/users')
  .get(users.index);
router.route('/users/:id')
  .get(users.show)
  .put(users.update)
  .delete(users.delete);

//restaurant routes
router.route("/restaurants")
  .get(restaurants.index)
  .post(restaurants.create);
router.route("/restaurants/:id")
  .get(restaurants.show)
  .put(restaurants.update)
  .delete(restaurants.delete);

module.exports = router;
