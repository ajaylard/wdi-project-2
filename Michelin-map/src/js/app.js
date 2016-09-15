const App = App || {};

App.init = function() {
  this.apiUrl = "http://localhost:3000/api";
  this.$main  = $("main");
  this.restaurantData = [];
  this.markers = [];

  this.homepage();

  $("#home").on("click", this.homepage.bind(this));
  $("#register").on("click", this.register.bind(this));
  $("#login").on("click", this.login.bind(this));
  $("#logout").on("click", this.logout.bind(this));
  $("#one-star").on("click", this.oneStar.bind(this));
  $("#two-star").on("click", this.twoStar.bind(this));
  $("#three-star").on("click", this.threeStar.bind(this));
  $(".starslabel").on("click", this.changeRadio);
  $("#location").on("click", this.currentLocation.bind(this));

  this.$main.on("submit", "form", this.handleForm);

  if (this.getToken()) {
    this.loggedInState();
  } else {
    this.loggedOutState();
  }
};

App.currentLocation = function() {
  navigator.geolocation.getCurrentPosition(function(position) {
    let icon = {
      url: `/images/findmepoint.png`,
      scaledSize: new google.maps.Size(35, 35),
      origin: new google.maps.Point(0,0),
      anchor: new google.maps.Point(0, 0)
    };
    let marker = new google.maps.Marker({
      position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
      map: App.map,
      animation: google.maps.Animation.DROP,
      icon: icon
    });

    App.map.setCenter(marker.getPosition());
  });
};

App.changeRadio = function() {

  if ($(this).attr("for") === "one-star") {
    $(this).children('img').attr("src", "/images/fullstar.png");
    $(this).siblings().children('img').attr("src", "/images/emptystar.png");
  } else if ( $(this).attr("for") === "two-star") {
    $(this).children('img').attr("src", "/images/fullstar.png");
    $(this).prev().children('img').attr("src", "/images/fullstar.png");
    $(this).next().children('img').attr("src", "/images/emptystar.png");
  } else {
    $(this).children('img').attr("src", "/images/fullstar.png");
    $(this).prev().children('img').attr("src", "/images/fullstar.png");
    $(this).prev().prev().children('img').attr("src", "/images/fullstar.png");
  }
};

App.homepage = function() {
  this.$main.html(`
    <h1>STAR GRAZING</h1>
    <h3>Find Michelin star restaurants in London</h3>
    <img id="homeimg" src="./images/cleanplatecrop.png">
    `);
  };

  App.login = function() {
    if (event) event.preventDefault();
    this.$main.html(`
      <h2>LOG IN</h2>
      <br>
      <form class="loginform" method="post" action="/login">
      <label>Email</label><br>
      <input class="signupspace" type="text" name="user[email]" autocomplete="off">
      <br>
      <label>Password</label><br>
      <input class="signupspace" type="password" name="user[password]">
      <br>
      <br>
      <br>
      <input class="submitbutton" type="submit" value="Sign in">
      </form>
      `);
    };

    App.register = function() {
      if (event) event.preventDefault();
      this.$main.html(`
        <h2>SIGN UP</h2>
        <form class="signupform" method="post" action="/register">
        <label>First Name</label><br>
        <input class="signupspace" type="text" name="user[firstname]">
        <br>
        <label>Last Name</label><br>
        <input class="signupspace" type="text" name="user[lastname]">
        <br>
        <label>Username</label><br>
        <input class="signupspace" type="text" name="user[username]">
        <br>
        <label>Email</label><br>
        <input class="signupspace" type="text" name="user[email]">
        <br>
        <label>Password</label><br>
        <input class="signupspace" type="password" name="user[password]">
        <br>
        <label>Password Confirmation</label><br>
        <input class="signupspace" type="password" name="user[passwordConfirmation]">
        <br>
        <br>
        <input class="submitbutton" type="submit" value="Sign up">
        </form>
        `);
      };

      App.handleForm = function() {
        event.preventDefault();

        let url    = `${App.apiUrl}${$(this).attr("action")}`;
        let method = $(this).attr("method");
        let data   = $(this).serialize();

        $(this).trigger('reset');

        return App.ajaxRequest(url, method, data, (data) => {
          if (data.token) App.setToken(data.token);
          App.loggedInState();
        });

      };

      App.ajaxRequest = function(url, method, data, callback){
        return $.ajax({
          url,
          method,
          data,
          beforeSend: this.setRequestHeader.bind(this)
        })
        .done(callback)
        .fail(data => {
          console.log(data);
        });
      };

      App.logout = function() {
        event.preventDefault();
        this.removeToken();
        this.loggedOutState();
      };

      App.stars = function (howMany) {
        let filteredRestaurants = [];

        this.removeAllMarkers();
        this.restaurantData.forEach(function (restaurant) {
          if (restaurant.michelinStars === howMany.toString()) {
            filteredRestaurants.push(restaurant);
          }
        });

        this.addMarkers(filteredRestaurants);
      };

      App.oneStar   = function(event) { this.stars("1"); };
      App.twoStar   = function(event) { this.stars("2"); };
      App.threeStar = function(event) { this.stars("3"); };

      App.loggedInState = function(){
        $("#loggedOut").hide();
        $("#loggedIn").show();
        $("#home").hide();
        this.mapSetup();
      };

      App.loggedOutState = function(){
        $("#loggedOut").show();
        $("#loggedIn").hide();
        $("#home").hide();
        this.homepage();
      };

      App.setRequestHeader = function(xhr, settings) {
        return xhr.setRequestHeader("Authorization", `Bearer ${this.getToken()}`);
      };

      App.setToken = function(token){
        return window.localStorage.setItem("token", token);
      };

      App.getToken = function(){
        return window.localStorage.getItem("token");
      };

      App.removeToken = function(){
        return window.localStorage.clear();
      };

      App.mapSetup = function() {
        this.$main.html(`<div id="map-canvas"></div>`);

        let canvas = document.getElementById('map-canvas');
        let mapOptions = {
          zoom: 13,
          center: new google.maps.LatLng(51.5142,-0.1247),
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          styles:[{"featureType":"administrative","elementType":"all","stylers":[{"visibility":"on"},{"lightness":33}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f7f7f7"}]},{"featureType":"poi.business","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#deecdb"}]},{"featureType":"poi.park","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":"25"}]},{"featureType":"road","elementType":"all","stylers":[{"lightness":"25"}]},{"featureType":"road","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#ffffff"}]},{"featureType":"road.highway","elementType":"labels","stylers":[{"saturation":"-90"},{"lightness":"25"}]},{"featureType":"road.arterial","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#ffffff"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"}]},{"featureType":"transit.line","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"transit.station","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"visibility":"on"},{"color":"#e0f1f9"}]}]
        };


        this.map = new google.maps.Map(canvas, mapOptions);
        this.getRestaurants();

      };

      App.getRestaurants = function(){
        return $.get(`${this.apiUrl}/restaurants`).done(this.responseHandler.bind(this));
      };

      App.removeAllMarkers = function () {
        this.markers.forEach((marker, index) => {
          marker.setMap(null);
        });
      };

      App.responseHandler = function(data) {
        this.restaurantData = data.restaurants;
        return this.addMarkers(this.restaurantData);
      };

      App.addMarkers = function(restaurantData) {
        return $.each(restaurantData, this.createMarkerForRestaurant.bind(this));
      };

      App.createMarkerForRestaurant = function(index, restaurant) {
        let latlng = new google.maps.LatLng(restaurant.lat, restaurant.lng);

        let icon = {
          url: `/images/${restaurant.michelinStars}.png`,
          scaledSize: new google.maps.Size(35, 35),
          origin: new google.maps.Point(0,0),
          anchor: new google.maps.Point(0, 0)
        };

        let marker = new google.maps.Marker({
          position: latlng,
          map: this.map,
          animation: google.maps.Animation.DROP,
          icon
        });

        this.markers.push(marker);

        this.addInfoWindowForRestaurant(restaurant, marker);
      };

      App.addInfoWindowForRestaurant = function(restaurant, marker) {
        google.maps.event.addListener(marker, 'click', () => {
          if (typeof this.infowindow != "undefined") this.infowindow.close();

          this.infowindow = new google.maps.InfoWindow({
            content: `
            <div class="info">
            <h2>${ restaurant.name }</h3>
            <h3 id="infostars" >${ `Michelin Stars: `+ restaurant.michelinStars }</h3>
            <p id="infocuisine">${ `Cuisine: `+ restaurant.cuisine}</p>
            <p>${ restaurant.description}</p>
            <p>${ `Address: `+restaurant.address+`, `+restaurant.postCode}</p>
            <a href=http://${restaurant.website}>${restaurant.website}</a>
            <p>${ `Email: `+ restaurant.email}</p>
            <p>${ `Meal Price: `+ restaurant.mealPrice}</p>
            </div>
            `
          });

          console.log("OI", restaurant.website.match(/\.(.*)\./).pop());

          this.infowindow.open(this.map, marker);
          this.map.setCenter(marker.getPosition());
        });
      };

      $(App.init.bind(App));


      // /////////////////map and markers//////////////////////////
      //
      // const googleMap = googleMap || {};
      //
      // googleMap.api_url = "http://localhost:3000/api";
      //
      // googleMap.init = function() {
      //   console.log("running");
      //   this.mapSetup();
      //   this.eventListeners();
      // };
      //
      // googleMap.eventListeners = function() {
      //   $('.location').on('click', this.getCurrentLocation);
      //   $('.new').on('click', this.toggleForm);
      //   $('main').on('submit', 'form', this.addRestaurant);
      // };
      //
      // googleMap.toggleForm  = function() {
      //   $('form').slideToggle();
      // };
      //
      // googleMap.getCurrentLocation = function() {
      //   navigator.geolocation.getCurrentPosition(function(position) {
      //     let marker = new google.maps.Marker({
      //       position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
      //       map: googleMap.map,
      //       animation: google.maps.Animation.DROP,
      //       icon: {
      //         url: "http://furtaev.ru/preview/user_on_map_2_small.png",
      //         scaledSize: new google.maps.Size(56, 56)
      //       }
      //     });
      //
      //     googleMap.map.setCenter(marker.getPosition());
      //   });
      // };
      //
      // googleMap.addRestaurant = function() {
      //   event.preventDefault();
      //   $.ajax({
      //     method: "POST",
      //     url: "http://localhost:3000/api/restaurants",
      //     data: $(this).serialize()
      //   }).done(data => {
      //     console.log(data.restaurant);
      //     googleMap.createMarkerForRestaurant(null, data.restaurant);
      //     $('form').reset().hide();
      //   });
      // };
      //
      //
      // googleMap.mapSetup = function() {
      //   let canvas = document.getElementById('map-canvas');
      //
      //   let mapOptions = {
      //     zoom: 13,
      //     center: new google.maps.LatLng(51.506178,-0.088369),
      //     mapTypeId: google.maps.MapTypeId.ROADMAP,
      //     styles: [{"featureType":"administrative","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"landscape","elementType":"all","stylers":[{"visibility":"simplified"},{"hue":"#0066ff"},{"saturation":74},{"lightness":100}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"off"},{"weight":0.6},{"saturation":-85},{"lightness":61}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"visibility":"on"}]},{"featureType":"road.arterial","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road.local","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"water","elementType":"all","stylers":[{"visibility":"simplified"},{"color":"#5f94ff"},{"lightness":26},{"gamma":5.86}]}]
      //   };
      //
      //   this.map = new google.maps.Map(canvas, mapOptions);
      //
      //   this.getRestaurants();
      // };
      //
      // googleMap.getRestaurants = function(){
      //   return $.get(`${this.api_url}/restaurants`).done(this.loopThroughRestaurants.bind(this));
      // };
      //
      // googleMap.loopThroughRestaurants = function(data) {
      //   return $.each(data.restaurants, this.createMarkerForRestaurant.bind(this));
      // };
      //
      // googleMap.createMarkerForRestaurant = function(index, restaurant) {
      //   let latlng = new google.maps.LatLng(restaurant.lat, restaurant.lng);
      //
      //   let marker = new google.maps.Marker({
      //     position: latlng,
      //     map: this.map,
      //     icon: {
      //       url: "http://furtaev.ru/preview/restaurant_map_pointer_small.png",
      //       scaledSize: new google.maps.Size(56, 56)
      //     }
      //   });
      //
      //   this.addInfoWindowForRestaurant(restaurant, marker);
      // };
      //
      // googleMap.addInfoWindowForRestaurant = function(restaurant, marker) {
      //   google.maps.event.addListener(marker, 'click', () => {
      //     if (typeof this.infowindow != "undefined") this.infowindow.close();
      //
      //     this.infowindow = new google.maps.InfoWindow({
      //       content: `
      //                 <div class="info">
      //                   <img src="${ restaurant.image}">
      //                   <h3>${ restaurant.name }</h3>
      //                   <p>${ restaurant.description}</p>
      //                 </div>
      //                `
      //     });
      //
      //     this.infowindow.open(this.map, marker);
      //     this.map.setCenter(marker.getPosition());
      //   });
      // };
      //
      // $(googleMap.init.bind(googleMap));
