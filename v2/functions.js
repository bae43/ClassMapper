/**
 * The MarkerClusterer object.
 * @type {MarkerCluster}
 */
var mc = null;

/**
 * The Map object.
 * @type {google.maps.Map}
 */
var map = null;

/**
 * The MarkerManager object.
 * @type {MarkerManager}
 */
var mgr = null;

/**
 * The KmlLayer object.
 * @type {google.maps.KmlLayer}
 */
var kmlLayer = null;

/**
 * The FusionTablesLayer object.
 * @type {google.maps.FusionTablesLayer}
 */
var fusionLayer = null;

/**
 * KML layer display/hide flag.
 * @type {boolean}
 */
var showKmlLayer = false;

/**
 * Fusion Tables layer display/hide flag.
 * @type {boolean}
 */
var showFusionLayer = false;

/**
 * Fusion Tables layer heatmap flag.
 * @type {boolean}
 */
var showFusionLayerHeatmap = false;

/**
 * Marker Clusterer display/hide flag.
 * @type {boolean}
 */
var showMarketClusterer = false;

/**
 * Marker Manager display/hide flag.
 * @type {boolean}
 */
var showMarketManager = false;

/**
 * Toggles heatmap use on Fusion Tables layer.
 */
function toggleFusionHeatmap() {
	if (fusionLayer) {
		showFusionLayerHeatmap = !showFusionLayerHeatmap;
		fusionLayer.set('heatmap', showFusionLayerHeatmap);
	}
}

/**
 * Toggles Fusion Tables layer visibility.
 */
function toggleFusion() {
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
		fusionLayer.setMap(map);
		li.style.visibility = 'visible';
	} else {
		fusionLayer.setMap(null);
		li.style.visibility = 'hidden';
	}
}

/**
 * Toggles KML layer visibility.
 */
function toggleKmlLayer() {
	if (!kmlLayer) {
		var kmlUrl = window.location.href.substring(0, 1 + window.location.href.lastIndexOf('/')) + 'markers.kml';
		kmlLayer = new google.maps.KmlLayer(kmlUrl, {
			preserveViewport : true,
			suppressInfoWindows : false
		});
	}
	showKmlLayer = !showKmlLayer;
	if (showKmlLayer) {
		kmlLayer.setMap(map);
	} else {
		kmlLayer.setMap(null);
	}
}

/**
 * Toggles Marker Manager visibility.
 */
function toggleMarkerManager() {
	showMarketManager = !showMarketManager;
	if (mgr) {
		if (showMarketManager) {
			mgr.addMarkers(markers.countries, 0, 5);
			mgr.addMarkers(markers.places, 6, 11);
			mgr.addMarkers(markers.locations, 12);
			mgr.refresh();
		} else {
			mgr.clearMarkers();
			mgr.refresh();
		}
	} else {
		mgr = new MarkerManager(map, {
			trackMarkers : true,
			maxZoom : 15
		});
		google.maps.event.addListener(mgr, 'loaded', function() {
			//mgr.addMarkers(markers.countries, 0, 5);
			// mgr.addMarkers(markers.places, 6, 11);
			// mgr.addMarkers(markers.locations, 12);
			mgr.refresh();
		});
	}
}

/**
 * Toggles Marker Clusterer visibility.
 */
function toggleMarkerClusterer() {
	showMarketClusterer = !showMarketClusterer;
	if (showMarketClusterer) {
		if (mc) {
			mc.addMarkers(markers.locations);
		} else {
			mc = new MarkerClusterer(map, markers.locations, {
				maxZoom : 19
			});
		}
	} else {
		mc.clearMarkers();
	}
}

function createMarker(latlng,placeName) {

	var marker = new google.maps.Marker({
		position : latlng,
		map : map,
		zIndex : Math.round(latlng.lat() * -100000) << 5
	});

	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent("<b>Location</b><br><span style='font-size: 12px;'>(" + latlng.lat().toFixed(4) + "," + latlng.lng().toFixed(4) + ")</span><br><span id='myAddress'>" + placeName+ "</span>");

		infowindow.open(map, marker);
	});
	google.maps.event.trigger(marker, 'click');
	return marker;
}

var marker = null;
var infowindow = new google.maps.InfoWindow({
	size : new google.maps.Size(150, 50)
});
function setMarkerPos(latlng, name){
					var zoom = map.getZoom();
				//	if(zoom < 8) map.setZoom(8);
				marker = new google.maps.Marker({
					position : latlng,
					map : map
				});
				map.panTo(latlng);
				if (marker) {
					marker.setMap(null);
					marker = null;
				}
				marker = createMarker(latlng,name);
}
function codeLatLng(geocoder, map, divId, latlng) {

	geocoder.geocode({
		'latLng' : latlng
	}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			if (results[1]) {
				setMarkerPos(latlng,results[1].formatted_address);
				//$("#" + divId).text(results[1].formatted_address);
			}
		} else {
			$("#" + divId).text("unknown");
		}
	});
}

function latLongOfLoc(placeName, pan) {
//placeName.replace(' ',"%20");
url = "http://maps.googleapis.com/maps/api/geocode/json";
	
	$.ajax({url: url, format:"json", data:{address:placeName, sensor:"false"}}).done(function(response){
		console.log(response);
		if(pan){
			var loc = response.results[0].geometry.location;
			var ll = new google.maps.LatLng(loc["lat"],loc["lng"]);
			map.panTo(ll);
			if(map.getZoom() < 8) map.setZoom(8);
			createMarker(ll, placeName);
		}
		
	});

}

/**
 * Initializes the map and listeners.
 */
function initialize() {

	styles = {
		'Chilled' : [{
			featureType : 'road',
			elementType : 'geometry',
			rules : [{
				'visibility' : 'simplified'
			}]
		}, {
			featureType : 'road.arterial',
			rules : [{
				hue : 149
			}, {
				saturation : -78
			}, {
				lightness : 0
			}]
		}, {
			featureType : 'road.highway',
			rules : [{
				hue : -31
			}, {
				saturation : -40
			}, {
				lightness : 2.8
			}]
		}, {
			featureType : 'poi',
			elementType : 'label',
			rules : [{
				'visibility' : 'off'
			}]
		}, {
			featureType : 'landscape',
			rules : [{
				hue : 163
			}, {
				saturation : -26
			}, {
				lightness : -1.1
			}]
		}, {
			featureType : 'transit',
			rules : [{
				'visibility' : 'off'
			}]
		}, {
			featureType : 'water',
			rules : [{
				hue : 3
			}, {
				saturation : -24.24
			}, {
				lightness : -38.57
			}]
		}]
	};

	map = new google.maps.Map(document.getElementById('map'), {
		center : new google.maps.LatLng(39, -15),
		// disableDefaultUI: true,
		zoom : 2,
		minZoom : 2,
		mapTypeId : 'terrain',

	});
	google.maps.event.addDomListener(document.getElementById('fusion-cb'), 'click', toggleFusion);
	google.maps.event.addDomListener(document.getElementById('fusion-hm-cb'), 'click', toggleFusionHeatmap);
	google.maps.event.addDomListener(document.getElementById('kml-cb'), 'click', toggleKmlLayer);
	google.maps.event.addDomListener(document.getElementById('mc-cb'), 'click', toggleMarkerClusterer);
	google.maps.event.addDomListener(document.getElementById('mgr-cb'), 'click', toggleMarkerManager);

	$.ajax({
		url : "http://localhost:8020/ClassMapper/chilled.json",
		context : document.body,
		format : "json"
	}).done(function(styles) {
		alert("asdf");
		console.log(styles);
		map.setOptions({
			styles : styles
		});

	});

	map.setOptions({
		styles : styles
	});
	var geocoder = new google.maps.Geocoder();

	google.maps.event.addListener(map, 'click', function(event) {
		//call function to create marker
		if (marker) {
			marker.setMap(null);
			marker = null;
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

			var marker = createMarker(place.geometry.location, place.name);

			markers.push(marker);

			bounds.extend(place.geometry.location);
		}

		map.fitBounds(bounds);
	});

	google.maps.event.addListener(map, 'bounds_changed', function() {
		var bounds = map.getBounds();
		searchBox.setBounds(bounds);
	});

}

function findLocation(fb_data) {

	input = $('#placeSearch');
	name = fb_data.location.name
	input.val(name);
	input.focus();
	console.log(fb_data);
	latlng = latLongOfLoc(name, true);
	
}

google.maps.event.addDomListener(window, 'load', initialize);
