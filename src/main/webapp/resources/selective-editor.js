var trackFields = [ {
	label : "Tracktype",
	name : "tracktype",
	type : "select",
	options : [ {
		value : ""
	}, {
		value : "grade1"
	}, {
		value : "grade2"
	}, {
		value : "grade3"
	}, {
		value : "grade4"
	}, {
		value : "grade5"
	} ]
}, {
	label : "Surface",
	name : "surface",
	type : "select",
	options : [ {
		value : ""
	}, {
		value : "artificial_turf"
	}, {
		value : "asphalt"
	}, {
		value : "cobblestone"
	}, {
		value : "concrete"
	}, {
		value : "compacted "
	}, {
		value : "dirt"
	}, {
		value : "grass"
	}, {
		value : "gravel"
	}, {
		value : "ground"
	}, {
		value : "metal"
	}, {
		value : "pebblestone"
	}, {
		value : "paved"
	}, {
		value : "sand"
	}, {
		value : "tartan"
	}, {
		value : "unpaved"
	}, {
		value : "wood"
	} ]
} ];

var myPosition = null;

var pendingWays = {};
var knownWays = {};

var map = new L.Map('map', {
	center : new L.LatLng(49.30, 9.19),
	zoom : 8
});

var tilesUrl = 'http://tiles.osmsurround.org/{z}/{x}/{y}.png';
var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
map.addLayer(new L.TileLayer(osmUrl, {
	maxZoom : 17,
	attribution : 'Map data &copy; OpenStreepMap contributors'
}));

var geojsonLayer = new L.GeoJSON();

geojsonLayer.on("featureparse", function(e) {
	if (e.properties && e.properties.style && e.layer.setStyle) {
		e.layer.setStyle(e.properties.style);
	}

	knownWays[e.properties.wayId] = e;

	(function(layer, props) {
		e.layer.on("mouseover", function(e) {
			layer.setStyle({
				color : "#ffff00"
			});
		});

		e.layer.on("mouseout", function(e) {
			layer.setStyle(props.style);
		});

	})(e.layer, e.properties);

	if (e.properties && e.properties.wayId) {
		e.layer.bindPopup(createEditorPopup(e.properties), {
			wayId : e.properties.wayId
		});
	}
});

function createField(field, fieldId, data) {
	var elem = $();
	var value = data[field.name] ? data[field.name] : "";
	if (field.type == "text") {
		elem = $('<input type="text" class="span3" value="' + value + '">');
	} else if (field.type == "textarea") {
		elem = $('<textarea style="height:200px" class="span3">' + value + '</textarea>');

	} else if (field.type == "select") {
		elem = $('<select class="input-small" />');
		var optionFound = false;
		for ( var x = 0; x < field.options.length; x++) {
			var optionValue = field.options[x].value;
			var optionLabel = field.options[x].label ? field.options[x].label : optionValue;
			var option = $('<option value="' + optionValue + '">' + optionLabel + '</option>');
			if (value == optionValue) {
				option.attr('selected', 'selected');
				optionFound = true;
			}
			elem.append(option);
		}
		if (!optionFound) {
			var option = $('<option value="' + value + '">' + value + '</option>');
			option.attr('selected', 'selected');
			elem.prepend(option);
		}
	}

	elem.attr("id", fieldId);
	elem.attr("name", field.name);
	if (field.postProcessor)
		field.postProcessor(elem);

	return $('<div class="controls" />').html(elem);
};

function createEditorPopup(props) {

	var tags = "";
	for ( var tag in props.tags) {
		tags += tag + "=" + props.tags[tag] + "<br>";
	}

	var elem = $('<div style="margin:10px;width:400px" />');

	elem.append('<h6><a href="http://www.openstreetmap.org/browse/way/' + props.wayId
			+ '" target="osmWay">Way ID ' + props.wayId + '</a></h6>Current tags:<br>' + tags);

	var form = $('<form class="form-horizontal" />');
	form.attr("id", "form_" + props.wayId);
	form.append('<input type="hidden" name="wayId" value="' + props.wayId + '" />');

	var fields = trackFields;

	var fieldset = $('<fieldset />');
	fieldset.append("<h6>Change properties</h6>");
	for ( var x = 0; x < fields.length; x++) {
		var fieldId = "input" + x;
		var field = $('<div class="control-group" />');
		field.append('<label class="control-label" for="' + fieldId + '">' + fields[x].label
				+ ':</label>');
		field.append(createField(fields[x], fieldId, props.tags));
		fieldset.append(field);
	}

	form.append(fieldset);
	form
			.append('<button type="button" class="btn btn-small btn-primary" onclick="saveWay(this.form);">Save</button>&nbsp;'
					+ '<button type="button" class="btn btn-small" onclick="cancelPopup(this.form);">Cancel</button>&nbsp;'
					+ '<button type="button" class="btn btn-small" onclick="selectWay('
					+ props.wayId + ');">open in JOSM</button>&nbsp;');
	elem.append(form);
	return $('<div class="modal-body" />').html(elem).html();
}

function cancelPopup(form) {
	var wayId = $(form).find("[name=wayId]").val();
	var knownWay = knownWays[wayId];
	map.closePopup(knownWay.layer._popup);
}

function saveWay(form) {

	if (assertAuthorized()) {

		var params = {};
		var wayId = $(form).find("[name=wayId]").val();
		params["wayId"] = wayId;
		params["tracktype"] = $(form).find("[name=tracktype]").val();
		params["surface"] = $(form).find("[name=surface]").val();

		pendingWays[wayId] = params;

		var knownWay = knownWays[wayId];
		$.extend(knownWay.properties.tags, params);
		knownWay.properties.style.color = "#0000ff";

		knownWay.layer.setStyle(knownWay.properties.style);

		map.closePopup(knownWay.layer._popup);
		updatePendingWays();
	}
}

function updatePendingWays() {
	var pendingWaysCount = 0;
	for ( var key in pendingWays) {
		pendingWaysCount++;
	}

	if (pendingWaysCount > 0)
		$('#changesSpan').html("&nbsp;(" + pendingWaysCount + ")");
	else
		$('#changesSpan').html("");

}

function clearPendingWays() {
	for ( var wayId in pendingWays) {
		geojsonLayer.removeLayer(knownWays[wayId].layer);
	}
	pendingWays = {};
	updatePendingWays();
}

function uploadChanges() {
	if (window.localStorage) {
		if ($.isEmptyObject(pendingWays)) {
			showMessageBox("No changes available for upload");
		} else {
			var token = localStorage.getItem('token');
			var secret = localStorage.getItem('secret');

			var model = {};
			model["ways"] = pendingWays;
			model["comment"] = prompt("Please enter a comment for the changeset:",
					"tracktype and surface update");
			model["token"] = token;
			model["tokenSecret"] = secret;

			$.ajax({
				'type' : 'POST',
				'url' : "wayEdit",
				'contentType' : 'application/json',
				'data' : JSON.stringify(model),
				'dataType' : 'json',
				'success' : function(result) {
					if (result.result == "OK") {
						clearPendingWays();
						updatePendingWays();
						showMessageBox("Upload successful");
					} else {
						alert(result.result);
					}
				}
			});
		}
	}
}

function downloadData() {
	if (map.getZoom() < 1) {
		showMessageBox("Please zoom in a little bit more to download data. Current zoom level ("+map.getZoom()+")");

	} else {

		if ($.isEmptyObject(pendingWays)
				|| confirm("You have unsaved changes. By downloading new data your changes will be lost.")) {

			clearPendingWays();
			knownWays = {};
			geojsonLayer.clearLayers();
			var bounds = map.getBounds();
			var sw = bounds.getSouthWest();
			var ne = bounds.getNorthEast();
			var params = "west=" + sw.lng + "&north=" + ne.lat + "&east=" + ne.lng + "&south="
					+ sw.lat;

			params += "&withoutSurface=" + $('#withoutSurface:checked').val();
			params += "&useOverpass=" + $('#useOverpass:checked').val();

			$.ajax({
				url : 'downloadData?' + params,
				dataType : 'json',
				error : function(event, xhr, options, exc) {
					alert("Error: " + event.statusText
							+ "\n\nProbably the current area is too big for "
							+ "the server.\nTry to zoom in a little.");
				},
				success : function(data) {
					if (data.features && data.features.length) {
						geojsonLayer.addGeoJSON(data);
						showMessageBox(data.features.length + " ways found.");
					} else
						alert("No tracks without tracktype tag found. This is good. Congrats!");
				}
			});
		}
	}
}

function showMessageBox(msg) {
	$('#messageBox span').html(msg);
	$('#messageBox').fadeIn(100).delay(2000).fadeOut(250);
}

function selectWay(wayId) {

	var bounds = map.getBounds();
	var sw = bounds.getSouthWest();
	var ne = bounds.getNorthEast();
	var params = "left=" + sw.lng + "&top=" + ne.lat + "&right=" + ne.lng + "&bottom=" + sw.lat
			+ "&select=way" + wayId + "";

	if ($('#tracktype').val() != 'none')
		params += "&addtags=tracktype=" + $('#tracktype').val();

	var url = "http://localhost:8111/zoom?" + params;
	$.ajax({
		url : url,
		error : function(event, xhr, options, exc) {
			alert("Error: " + event.statusText
					+ "\n\n\nThere is a problem with JavaScript permissions.\nMake sure "
					+ "you can execute scripts within the localhost domain. NoScript active?");
		},
		scusss : function(result, text) {
			if (text != "success")
				showMessageBox("[" + result + "]");
		}
	});

}

$.ajaxSetup({
	complete : function(event, xhr, options, exc) {
		$('#downloadButton').removeAttr("disabled");
		$('#loading').hide();
	},
	beforeSend : function(xhr, settings) {
		$('#downloadButton').attr("disabled", "disabled");
		$('#loading').show();
	}
});

map.addLayer(geojsonLayer);
map.on("popupopen", function(clickEvent) {
	var wayId = clickEvent.popup.options["wayId"];
	var params = pendingWays[wayId];
	if (params) {
		for ( var key in params) {
			var value = params[key];
			var elem = $('#form_' + wayId).find('[name=' + key + ']');
			elem.val(value);
		}
	}
});
map.on("moveend", function(moveEvent) {
	if (window.localStorage) {
		var lonLat = map.getCenter();
		localStorage.setItem("lastLat", lonLat.lat);
		localStorage.setItem("lastLon", lonLat.lng);
		localStorage.setItem("lastZoom", map.getZoom());
	}

});

function assertAuthorized() {
	if (localStorage.getItem('token') && localStorage.getItem('secret')) {
		return true;
	} else {
		alert("Please login with OSM first.");
		return false;
	}
}

function clearOauth() {
	localStorage.removeItem("token");
	localStorage.removeItem("secret");
	localStorage.removeItem("username");
	showMessageBox("OAuth tokens deleted");
	updateOauth('', '', '');
}

function updateOauth(token, secret, username) {
	if (window.localStorage) {
		if (token != '') {
			localStorage.setItem("token", token);
			localStorage.setItem("secret", secret);
			localStorage.setItem("username", username ? username : "unknown");
			showMessageBox("New OAuth tokens received");

		} else if (localStorage.getItem('token') && localStorage.getItem('secret')) {
			showMessageBox("OAuth tokens available.<br>Please read <strong>About</strong> for more information.");
		}

		username = localStorage.getItem('username');

		if (username && username != '') {
			$('#loginLabel').html('<a href="oauthRequest">User: <b>' + username + '</b></a>');
			$('#logoutLabel').show();
		} else {
			$('#loginLabel').html('<a href="oauthRequest">Login</a>');
			$('#logoutLabel').hide();
		}

		var lastLon = localStorage.getItem('lastLon');
		var lastLat = localStorage.getItem('lastLat');
		var lastZoom = localStorage.getItem('lastZoom');

		var posAvailable = lastLon && (lastLon != "undefined") && lastLat
				&& (lastLat != "undefined");

		if (posAvailable) {
			map.setView(new L.LatLng(lastLat, lastLon), lastZoom);
		}

	} else {
		alert("Your browser does not support local storage. You won't be able to perform any changes.");
	}
}

var Location = {
	search : function(position) {
		if (position.coords) {
			var lat = position.coords.latitude;
			var lon = position.coords.longitude;
			map.setView(new L.LatLng(lat, lon), 15);
			myPosition = new L.Marker(new L.LatLng(lat, lon));
			map.addLayer(myPosition);
		}
	},

	findMe : function() {
		if (navigator.geolocation) {
			if (myPosition != null)
				map.removeLayer(myPosition);

			navigator.geolocation.getCurrentPosition(Location.search, function(error) {
				if (error.code == 1) {
					alert("Access not allowed.");
				} else if (error.code == 2) {
					alert("Position cannot be determined.");
				} else if (error.core == 3) {
					alert("No result after 120 seconds. Please try again.");
				}
			}, {
				timeout : 120000,
				enableHighAccuracy : true
			});
		} else
			alert("No GEO Location support");
	}

};

$('.modal').modal({
	show : false
});