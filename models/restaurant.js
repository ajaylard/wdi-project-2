const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  name:           { type: String, trim: true },
  phoneNumber:    { type: String, trim: true },
  address:        { type: String, trim: true },
  postCode:       { type: String, trim: true },
  website:        { type: String, trim: true },
  email:          { type: String, trim: true },
  mealPrice:      { type: String, trim: true },
  michelinStars:  { type: String, trim: true },
  cuisine:        { type: String, trim: true },
  description:    { type: String, trim: true },
  lat:            { type: String, time: true },
  lng:            { type: String, time: true },
}, {
  timestamps: true
});

module.exports = mongoose.model("Restaurant", restaurantSchema);

// name: data.name,
// phoneNumber: data.phone,
// address: data.address,
// postCode: data.postcode,
// website: data.web,
// email: data.email,
// mealPrice: data.meal_price,
// michelinStars: data.michelin_stars,
// cuisine: data.cooking_lib
// description: data.description,
// lat: data.latitude,
// lng: data.longitude
