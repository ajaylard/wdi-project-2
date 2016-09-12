const googleMap = googleMap || {};

googleMap.api_url = "http://localhost:3000/api";

googleMap.init = function() {
  console.log("running");
  this.mapSetup();
  this.eventListeners();
};

googleMap.eventListeners = function() {
  $('.location').on('click', this.getCurrentLocation);
  $('.new').on('click', this.toggleForm);
  $('main').on('submit', 'form', this.addRestaurant);
};

googleMap.toggleForm  = function() {
  $('form').slideToggle();
};

googleMap.getCurrentLocation = function() {
  navigator.geolocation.getCurrentPosition(function(position) {
    let marker = new google.maps.Marker({
      position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
      map: googleMap.map,
      animation: google.maps.Animation.DROP,
      icon: {
        url: "http://furtaev.ru/preview/user_on_map_2_small.png",
        scaledSize: new google.maps.Size(56, 56)
      }
    });

    googleMap.map.setCenter(marker.getPosition());
  });
};

googleMap.addRestaurant = function() {
  event.preventDefault();
  $.ajax({
    method: "POST",
    url: "http://localhost:3000/api/restaurants",
    data: $(this).serialize()
  }).done(data => {
    console.log(data.restaurant);
    googleMap.createMarkerForRestaurant(null, data.restaurant);
    $('form').reset().hide();
  });
};


googleMap.mapSetup = function() {
  let canvas = document.getElementById('map-canvas');

  let mapOptions = {
    zoom: 13,
    center: new google.maps.LatLng(51.506178,-0.088369),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: [{"featureType":"administrative","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"landscape","elementType":"all","stylers":[{"visibility":"simplified"},{"hue":"#0066ff"},{"saturation":74},{"lightness":100}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"off"},{"weight":0.6},{"saturation":-85},{"lightness":61}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"visibility":"on"}]},{"featureType":"road.arterial","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road.local","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"water","elementType":"all","stylers":[{"visibility":"simplified"},{"color":"#5f94ff"},{"lightness":26},{"gamma":5.86}]}]
  };

  this.map = new google.maps.Map(canvas, mapOptions);

  this.getRestaurants();
};

googleMap.getRestaurants = function(){
  return $.get(`${this.api_url}/restaurants`).done(this.loopThroughRestaurants.bind(this));
};

googleMap.loopThroughRestaurants = function(data) {
  return $.each(data.restaurants, this.createMarkerForRestaurant.bind(this));
};

googleMap.createMarkerForRestaurant = function(index, restaurant) {
  let latlng = new google.maps.LatLng(restaurant.lat, restaurant.lng);

  let marker = new google.maps.Marker({
    position: latlng,
    map: this.map,
    icon: {
      url: "http://furtaev.ru/preview/restaurant_map_pointer_small.png",
      scaledSize: new google.maps.Size(56, 56)
    }
  });

  this.addInfoWindowForRestaurant(restaurant, marker);
};

googleMap.addInfoWindowForRestaurant = function(restaurant, marker) {
  google.maps.event.addListener(marker, 'click', () => {
    if (typeof this.infowindow != "undefined") this.infowindow.close();

    this.infowindow = new google.maps.InfoWindow({
      content: `
                <div class="info">
                  <img src="${ restaurant.image}">
                  <h3>${ restaurant.name }</h3>
                  <p>${ restaurant.description}</p>
                </div>
               `
    });

    this.infowindow.open(this.map, marker);
    this.map.setCenter(marker.getPosition());
  });
};

$(googleMap.init.bind(googleMap));