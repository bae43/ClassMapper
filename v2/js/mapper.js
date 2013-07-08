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
	if (markers) {
		this.markers = markers;
	}

	this.map = new google.maps.Map($("#map").get(0), {
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

	google.maps.event.addDomListener(document.getElementById('fusion-cb'), 'click', this.toggleFusion.bind(this));
	// google.maps.event.addDomListener(document.getElementById('fusion-hm-cb'), 'click', this.toggleFusionHeatmap.bind(this));
	// google.maps.event.addDomListener(document.getElementById('kml-cb'), 'click', toggleKmlLayer);
	google.maps.event.addDomListener(document.getElementById('mc-cb'), 'click', this.toggleMarkerClusterer.bind(this));
	// google.maps.event.addDomListener(document.getElementById('mgr-cb'), 'click', this.toggleMarkerManager.bind(this));

	$.ajax({
		url : "http://localhost:8020/ClassMapper/v2/js/themes.json",
		context : document.body,
		format : "json"
	}).done( function(styles) {
		console.log(styles);
		this.map.setOptions({
			styles : styles.blue
		});

	}.bind(this));

	google.maps.event.addListener(this.map, 'click', function(event) {
		//call function to create marker
		if (this.myMarker) {
			this.myMarker.setMap(null);
			this.myMarker = null;
		}
		//marker = createMarker(event.latLng, "name", "<b>Location</b><br><span style='font-size: 12px;'>(" + event.latLng.lat().toFixed(4) + "," + event.latLng.lng().toFixed(4)  + ")</span><br><span id='myAddress'></span>");
		this.codeLatLng(this.geocoder, this.map, "myAddress", event.latLng);
	}.bind(this));

	// Prepares the marker object, creating a google.maps.Marker object for each
	// location, place and country
	if (this.markers) {
		for (var level in this.markers) {
			for (var i = 0; i < this.markers[level].length; i++) {
				var details = this.markers[level][i];
				this.markers[level][i] = new google.maps.Marker({
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

	var searchMarkers = [];

	var input = (document.getElementById('placeSearch'));
	var searchBox = new google.maps.places.SearchBox(input);

	google.maps.event.addListener(searchBox, 'places_changed', function() {
		var places = searchBox.getPlaces();

		for (var i = 0, marker; marker = searchMarkers[i]; i++) {
			marker.setMap(null);
		}
		// create a temporary set of markers that are different (smaller) and clear later
		searchMarkers = [];
		var bounds = new google.maps.LatLngBounds();
		if (places[0]) {
			this.myMarker = this.createMarker(places[0].geometry.location, places[0].name);
		}

		// for (var i = 0, place; place = places[i]; i++) {
		// var image = {
		// url : place.icon,
		// size : new google.maps.Size(71, 71),
		// origin : new google.maps.Point(0, 0),
		// anchor : new google.maps.Point(17, 34),
		// scaledSize : new google.maps.Size(25, 25)
		// };
		//
		// this.myMarker = this.createMarker(place.geometry.location, place.name);
		//
		// markers.push(this.myMarker);
		//
		// bounds.extend(place.geometry.location);
		// }
		//
		// this.map.fitBounds(bounds);
	}.bind(this));

	google.maps.event.addListener(this.map, 'bounds_changed', function() {
		// TODO - handle multiple returns (e.g. "Austin")
		var bounds = this.map.getBounds();
		searchBox.setBounds(bounds);
	}.bind(this));

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

		google.maps.event.addListener(marker, 'click', function() {
			this.myMarkerInfo.setContent("<b>Location</b><br><span style='font-size: 12px;'>(" + latlng.lat().toFixed(4) + "," + latlng.lng().toFixed(4) + ")</span><br><span id='myAddress'>" + placeName + "</span>");

			this.myMarkerInfo.open(this.map, this.myMarker);
		}.bind(this));
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
		this.map.panTo(latlng);
		if (this.myMarker) {
			this.myMarker.setMap(null);
			this.myMarker = null;
		}
		this.myMarker = this.createMarker(latlng, name);
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
		}).done( function(response) {
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
					this.setMarkerPos(latlng, results[1].formatted_address);
					//$("#" + divId).text(results[1].formatted_address);
				}
			} else {
				$("#" + divId).text("unknown");
			}
		}.bind(this));
	},

	/**
	 * Toggles Marker Clusterer visibility.
	 */
	toggleMarkerClusterer : function() {
		showMarketClusterer = !showMarketClusterer;
		if (showMarketClusterer) {
			if (this.mc) {
				this.mc.addMarkers(this.markers.locations);
			} else {
				this.mc = new MarkerClusterer(this.map, this.markers.locations, {
					maxZoom : 19
				});
			}
		} else {
			this.mc.clearMarkers();
		}
	},

	/**
	 * Toggles Marker Manager visibility.
	 */
	toggleMarkerManager : function() {
		showMarketManager = !showMarketManager;
		if (this.mgr) {
			if (showMarketManager) {
				this.mgr.addMarkers(this.markers.countries, 0, 5);
				this.mgr.addMarkers(this.markers.places, 6, 11);
				this.mgr.addMarkers(this.markers.locations, 12);
				this.mgr.refresh();
			} else {
				this.mgr.clearMarkers();
				this.mgr.refresh();
			}
		} else {
			this.mgr = new MarkerManager(this.map, {
				trackMarkers : true,
				maxZoom : 15
			});
			google.maps.event.addListener(this.mgr, 'loaded', function() {
				//mgr.addMarkers(markers.countries, 0, 5);
				// mgr.addMarkers(markers.places, 6, 11);
				// mgr.addMarkers(markers.locations, 12);
				this.mgr.refresh();
			});
		}
	},

	/**
	 * Toggles Fusion Tables layer visibility.
	 * Toggles Fusion Tables layer visibility.
	 */
	toggleFusion : function() {
		if (!fusionLayer) {
			fusionLayer = new google.maps.FusionTablesLayer(232506, {
				suppressInfoWindows : false
			});
			showFusionLayerHeatmap = false;
			fusionLayer.set('heatmap', showFusionLayerHeatmap);
		}
		showFusionLayer = !showFusionLayer;
		var li = document.getElementById('fusion-hm-li');
		if (showFusionLayer) {
			fusionLayer.setMap(this.map);
			li.style.visibility = 'visible';
		} else {
			fusionLayer.setMap(null);
			li.style.visibility = 'hidden';
		}
	}
}

//google.maps.event.addDomListener(window, 'load', initialize);