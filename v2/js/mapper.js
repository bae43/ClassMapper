Function.prototype.bind = function(scope) {
	var _function = this;
	return function() {
		return _function.apply(scope, arguments);
	}
}
var mapper = {};

mapper.UI = function() {
	this.accessToken = "";
	this.myMarker = null;

	this.map = new google.maps.Map(document.getElementById('map'), {
		center : new google.maps.LatLng(39, -15),
		// disableDefaultUI: true,
		zoom : 2,
		minZoom : 2,
		mapTypeId : 'terrain',

	});

	this.myMarkerInfo = new google.maps.InfoWindow({
		size : new google.maps.Size(150, 50)
	});

	this.geocoder = new google.maps.Geocoder();

	google.maps.event.addDomListener(document.getElementById('fusion-cb'), 'click', toggleFusion);
	google.maps.event.addDomListener(document.getElementById('fusion-hm-cb'), 'click', toggleFusionHeatmap);
	google.maps.event.addDomListener(document.getElementById('kml-cb'), 'click', toggleKmlLayer);
	google.maps.event.addDomListener(document.getElementById('mc-cb'), 'click', toggleMarkerClusterer);
	google.maps.event.addDomListener(document.getElementById('mgr-cb'), 'click', toggleMarkerManager);

	$.ajax({
		url : "http://localhost:8020/ClassMapper/v2/js/themes.json",
		context : document.body,
		format : "json"
	}).done(function(styles) {
		console.log(styles);
		map.setOptions({
			styles : styles.blue
		});

	});

	google.maps.event.addListener(map, 'click', function(event) {
		//call function to create marker
		if (this.myMarker) {
			this.myMarker.setMap(null);
			this.myMarker = null;
		}
		//marker = createMarker(event.latLng, "name", "<b>Location</b><br><span style='font-size: 12px;'>(" + event.latLng.lat().toFixed(4) + "," + event.latLng.lng().toFixed(4)  + ")</span><br><span id='myAddress'></span>");
		codeLatLng(geocoder, map, "myAddress", event.latLng);
	});

	// Prepares the marker object, creating a google.maps.Marker object for each
	// location, place and country
	if (markers) {
		for (var level in markers) {
			for (var i = 0; i < markers[level].length; i++) {
				var details = markers[level][i];
				markers[level][i] = new google.maps.Marker({
					title : details.level,
					position : new google.maps.LatLng(details.location[0], details.location[1]),
					clickable : false,
					draggable : true,
					flat : true
				});
			}
		}
	}

	// $(document).ready(function() {
	// $("#button").click(function() {
	// var name = $("#name").val();
	// var message = $("#message").val();
	//
	// $.ajax({
	// type : "POST",
	// url : "updateLoc.php",
	// data : {
	// name : name,
	// message : message
	// },
	// success : function(data) {
	// $("#info").html(data);
	// }
	// });
	//
	// return false;
	// });
	// });

	var markers = [];

	var input = /** @type {HTMLInputElement} */(document.getElementById('placeSearch'));
	var searchBox = new google.maps.places.SearchBox(input);

	google.maps.event.addListener(searchBox, 'places_changed', function() {
		var places = searchBox.getPlaces();

		for (var i = 0, marker; marker = markers[i]; i++) {
			marker.setMap(null);
		}

		markers = [];
		var bounds = new google.maps.LatLngBounds();
		for (var i = 0, place; place = places[i]; i++) {
			var image = {
				url : place.icon,
				size : new google.maps.Size(71, 71),
				origin : new google.maps.Point(0, 0),
				anchor : new google.maps.Point(17, 34),
				scaledSize : new google.maps.Size(25, 25)
			};

			this.myMarker = createMarker(place.geometry.location, place.name);

			markers.push(this.myMarker);

			bounds.extend(place.geometry.location);
		}

		map.fitBounds(bounds);
	});

	google.maps.event.addListener(map, 'bounds_changed', function() {
		var bounds = map.getBounds();
		searchBox.setBounds(bounds);
	});

	$('#fb_button').click( function() {

		console.log("fb clicked");
		this.prototype.fb_change_login();
	}.bind(this));

}

mapper.UI.prototype = {
	updateFBLoginStatus : function(status) {
		alert(status);
	},
	fb_change_login : function() {

		var fbLoggedIn = false;
		if (fbLoggedIn) {
			FB.logout( function(response) {
				alert("logging out");
			}.bind(this));
		} else {
			FB.login( function(response) {
				alert("attemping login");
				if (response.authResponse) {
					this.accessToken = response.authResponse.accessToken;
					alert("logging in");
				}
			}.bind(this), {
				scope : 'user_about_me,user_photos,friends_photos'
			});
		}
	},
	createMarker : function(latlng, placeName) {

		var marker = new google.maps.Marker({
			position : latlng,
			map : this.map,
			zIndex : Math.round(latlng.lat() * -100000) << 5
		});

		google.maps.event.addListener(this.myMarker, 'click', function() {
			infowindow.setContent("<b>Location</b><br><span style='font-size: 12px;'>(" + latlng.lat().toFixed(4) + "," + latlng.lng().toFixed(4) + ")</span><br><span id='myAddress'>" + placeName + "</span>");

			infowindow.open(this.map, this.myMarker);
		});
		google.maps.event.trigger(marker, 'click');
		return marker;
	},

	setMarkerPos : function(latlng, name) {
		var zoom = this.map.getZoom();
		//	if(zoom < 8) map.setZoom(8);
		this.myMarker = new google.maps.Marker({
			position : latlng,
			map : this.map
		});
		map.panTo(latlng);
		if (this.myMarker) {
			this.myMarker.setMap(null);
			this.myMarker = null;
		}
		this.myMarker = createMarker(latlng, name);
	},
	findLocation : function(fb_data) {

		input = $('#placeSearch');
		name = fb_data.location.name
		input.val(name);
		input.focus();
		console.log(fb_data);
		latlng = this.setMarkerToPlace(name);

	},

	setMarkerToPlace : function(placeName, pan) {
		//placeName.replace(' ',"%20");
		url = "http://maps.googleapis.com/maps/api/geocode/json";

		$.ajax({
			url : url,
			format : "json",
			data : {
				address : placeName,
				sensor : "false"
			}
		}).done(function(response) {
			console.log(response);
			var loc = response.results[0].geometry.location;
			var ll = new google.maps.LatLng(loc["lat"], loc["lng"]);
			this.setMarkerPos(ll, placeName);

		}.bind(this));

	},
	codeLatLng : function(geocoder, map, divId, latlng) {

		geocoder.geocode({
			'latLng' : latlng
		}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				if (results[1]) {
					setMarkerPos(latlng, results[1].formatted_address);
					//$("#" + divId).text(results[1].formatted_address);
				}
			} else {
				$("#" + divId).text("unknown");
			}
		});
	}
}

//google.maps.event.addDomListener(window, 'load', initialize);