const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  name:           { type: String, trim: true, required: true },
  phoneNumber:    { type: String, trim: true, required: true },
  address:        { type: String, trim: true, required: true },
  postCode:       { type: String, trim: true, required: true },
  website:        { type: String, trim: true, required: true },
  email:          { type: String, trim: true, required: true },
  mealPrice:      { type: String, trim: true, required: true },
  michelinStars:  { type: String, trim: true, required: true },
  cuisine:        { type: String, trim: true, required: true },
  description:    { type: String, trim: true, required: true },
  lat:            { type: String, time: true, required: true },
  lng:            { type: String, time: true, required: true },
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
