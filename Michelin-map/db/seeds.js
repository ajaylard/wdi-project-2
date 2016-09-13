const mongoose = require("mongoose");
const config   = require("../config/config");
const request  = require("request-promise");

const Restaurant = require("../models/restaurant");
const url        = "http://apir.viamichelin.com/apir/2/findPoi.json2/RESTAURANT/eng?center=-0.12:51.50&nb=100&dist=5000&source=RESGR&filter=AGG.provider%20eq%20RESGR&charset=UTF-8&ie=UTF-8&authKey=RESTGP20160912161657237437181916";

mongoose.connect(config.db);

Restaurant.collection.drop();

request(url)
.then(data => {
  let json = JSON.parse(data);

  json.poiList.forEach((poi) => {
    let data = poi.datasheets[0];

    let restaurant = {
      name: data.name,
      phoneNumber: data.phone,
      address: data.address,
      postCode: data.postcode,
      website: data.web,
      email: data.email,
      mealPrice: data.meal_price,
      michelinStars: data.michelin_stars,
      cuisine: data.cooking_lib,
      description: data.description,
      lat: data.latitude,
      lng: data.longitude
    };

    Restaurant.create(restaurant, (err, restaurant) => {
      if (err) return console.error(err);
      return console.log(`${restaurant.name} was saved.`);
    });
  });
});
