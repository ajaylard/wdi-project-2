const express = require('express');
const router  = express.Router();


const authentications = require("../controllers/authentications");
const users           = require("../controllers/users");
const statics         = require("../controllers/statics");
const restaurants     = require("../controllers/restaurants");


router.route("/")
  .get(statics.home);

router.route("/register")
  .post(authentications.register);
router.route("/login")
  .post(authentications.login);
router.route('/users/:id')
  .get(users.show)
  .put(users.update)
  .delete(users.delete);
router.route("/restaurants")
  .get(restaurants.index);

module.exports = router;
