var templates = {
	building : {
		"building" : {
			label : "Building",
			name : "building",
			type : "select",
			options : [ {
				value : ""
			}, {
				value : "yes"
			} ]
		},

		"addr:street" : {
			label : "Street",
			name : "addr:street",
			type : "text"
		},
		"addr:housenumber" : {
			label : "Housenumber",
			name : "addr:housenumber",
			type : "text"
		},
		"addr:postcode" : {
			label : "Postcode",
			name : "addr:postcode",
			type : "text"
		},
		"addr:city" : {
			label : "City",
			name : "addr:city",
			type : "text"
		},
		"addr:country" : {
			label : "Country",
			name : "addr:country",
			type : "text"
		}
	},
	track : {
		tracktype : {
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
		},
		surface : {
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
		}
	}
};

var myPosition = null;

var pendingWays = {};
var knownWays = {};

var map = new L.Map('map', {
	center : new L.LatLng(49.30, 9.19),
	zoom : 8
});

var tilesUrl = 'http://tiles.osmsurround.org/{z}/{x}/{y}.png';

var ocmLayer = new L.TileLayer(
		'http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png',
		{
			maxZoom : 16,
			attribution : 'Tiles created by <a href="http://www.gravitystorm.co.uk">Andy Allan</a> and Dave Stubbs, Map data &copy; <a href="http://www.openstreetmap.org">OpenStreepMap</a> contributors'
		});

var osmLayer = new L.TileLayer(
		'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
		{
			maxZoom : 18,
			attribution : 'Map data &copy; <a href="http://www.openstreetmap.org">OpenStreepMap</a> contributors'
		});

var habLayer = new L.TileLayer(
		'http://toolserver.org/tiles/hikebike/{z}/{x}/{y}.png',
		{
			maxZoom : 18,
			attribution : 'Tiles created by <a href="http://hikebikemap.de/">Hike & Bike Map</a>, Map data &copy; <a href="http://www.openstreetmap.org">OpenStreepMap</a> contributors'
		});

var baseLayers = {
	"OpenStreetMap" : osmLayer,
	"Hike & Bike Map" : habLayer,
	"OpenCycleMap" : ocmLayer
};

map.addLayer(osmLayer);

var geojsonLayer = new L.GeoJSON();

var overlayLayers = {
	"Tracks" : geojsonLayer
};

map.addLayer(geojsonLayer);

map.addControl(new L.Control.Layers(baseLayers, overlayLayers));

geojsonLayer.on("featureparse", function(e) {
	if (e.properties && e.properties.style && e.layer.setStyle) {
		e.layer.setStyle(e.properties.style);
	}

	knownWays[e.properties.objectId] = e;

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

	if (e.properties && e.properties.objectId) {
		e.layer.bindPopup(createEditorPopup(e.properties), {
			objectId : e.properties.objectId
		});
	}
});

function createField(field, fieldId, data) {
	var elem = $();
	var value = data[field.name] ? data[field.name] : "";
	if (field.type == "text") {
		elem = $('<input type="text" class="input-medium" value="' + value + '">');
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

function createFieldElement(x, currentField, props) {
	var fieldId = "input" + x;
	var field = $('<div class="control-group" />');
	field.append('<label class="control-label" for="' + fieldId + '">' + currentField.label
			+ ':</label>');
	field.append(createField(currentField, fieldId, props.tags));
	return field;
}

function createEditorPopup(props) {

	var tags = "";
	for ( var tag in props.tags) {
		tags += tag + "=" + props.tags[tag] + "<br>";
	}

	var elem = $('<div style="margin:10px;width:300px;" />');

	elem.append('<h6><a href="http://www.openstreetmap.org/browse/way/' + props.objectId
			+ '" target="osmWay">Way ID ' + props.objectId + '</a></h6>');

	var form = $('<form class="form-horizontal" />');
	form.attr("id", "form_" + props.objectId);
	form.append('<input type="hidden" name="objectId" value="' + props.objectId + '" />');

	var fields = templates[props.objectType];
	var requiredFields = [];
	var fieldset = $('<fieldset />');
	fieldset.append("<h6>Change properties</h6>");

	var fieldsetDiv = $('<div class="fieldset-fields" style="max-height:280px;overflow-y:scroll;margin-bottom:5px" />');
	var x = 0;
	for ( var tag in fields) {
		x++;
		var currentField = fields[tag];
		requiredFields.push(tag);
		fieldsetDiv.append(createFieldElement(x, currentField, props));
	}

	for ( var tag in props.tags) {
		x++;
		var currentField = {
			name : tag,
			label : tag,
			type : "text"
		};
		if ($.inArray(tag, requiredFields) == -1) {
			fieldsetDiv.append(createFieldElement(x, currentField, props));
		}
	}
	fieldset.append(fieldsetDiv);
	form.append(fieldset);
	form
			.append('<div style="margin-top:5px"><button type="button" class="btn btn-small btn-primary" onclick="saveWay(this.form);">Save</button>&nbsp;'
					+ '<button type="button" class="btn btn-small" onclick="cancelPopup(this.form);">Cancel</button>&nbsp;'
					+ '<button type="button" class="btn btn-small" onclick="addTag(this.form);">Add tag</button>&nbsp;'
					+ '<button type="button" class="btn btn-small" onclick="selectWay('
					+ props.objectId + ');">Open in JOSM</button></div>');
	elem.append(form);
	return $('<div class="modal-body" />').html(elem).html();
}

function cancelPopup(form) {
	var objectId = $(form).find("[name=objectId]").val();
	var knownWay = knownWays[objectId];
	map.closePopup(knownWay.layer._popup);
}

function addTag(form) {
	var tag = prompt("Please enter the tag name:");
	if (tag) {
		var currentField = {
			name : tag,
			label : tag,
			type : "text"
		};
		var elem = createFieldElement(new Date().getTime(), currentField, {tags:{}});
		$(form).find("div.fieldset-fields").append(elem);
		elem.find(":input").get(0).focus();
	}
}

function saveWay(form) {
	if (assertAuthorized()) {
		var osmObject = {};
		var objectId = $(form).find("[name=objectId]").val();
		osmObject["objectId"] = objectId;
		var tags = {};
		$(form).find("fieldset :input").each(function() {
			tags[$(this).attr("name")] = $(this).val();

		});
		osmObject["tags"] = tags;

		pendingWays[objectId] = osmObject;

		var knownWay = knownWays[objectId];
		$.extend(knownWay.properties.tags, tags);
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
	for ( var objectId in pendingWays) {
		geojsonLayer.removeLayer(knownWays[objectId].layer);
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
	if (map.getZoom() < 13) {
		showMessageBox("Please zoom in a little bit more to download data. Current zoom level ("
				+ map.getZoom() + ")");

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
			params += "&allTracks=" + $('#allTracks:checked').val();
			params += "&showBuildings=" + $('#showBuildings:checked').val();

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
						showMessageBox(data.features.length + " objects found.");
						localStorage.setItem("lastData", JSON.stringify(data));
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

function selectWay(objectId) {

	var bounds = map.getBounds();
	var sw = bounds.getSouthWest();
	var ne = bounds.getNorthEast();
	var params = "left=" + sw.lng + "&top=" + ne.lat + "&right=" + ne.lng + "&bottom=" + sw.lat
			+ "&select=way" + objectId + "";

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

map.on("popupopen", function(clickEvent) {
	var objectId = clickEvent.popup.options["objectId"];
	var params = pendingWays[objectId];
	if (params) {
		for ( var key in params.tags) {
			var value = params.tags[key];
			var elem = $('#form_' + objectId).find('[name="' + key + '"]');
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

		if (localStorage.getItem('lastData')) {

			var lastData = $.parseJSON(localStorage.getItem('lastData'));
			if (lastData) {
				geojsonLayer.addGeoJSON(lastData);
				showMessageBox(lastData.features.length + " objects found.");
			}
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