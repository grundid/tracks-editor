var myPosition = null;
var support = null;

var pendingWays = {};
var knownWays = {};

var options = {
	token : '',
	secret : '',
	username : '',
	mobile : false
};

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


var geojsonLayer = L.geoJson(null, {
	style: function (feature) {
		return {color: feature.properties.color};
	},
	onEachFeature: function (feature, layer) {
			if (feature.properties && feature.properties.style && layer.setStyle) {
				layer.setStyle(feature.properties.style);
			}
                        
                        var arrowLayer = L.polylineDecorator(layer,{patterns: [
                        /*{offset: 100+'%', repeat: 0, symbol: L.Symbol.arrowHead(
                                    {pixelSize: 7, polygon: false, pathOptions: {stroke: true}})},*/
                         {offset:'50px', repeat: '50px', symbol: L.Symbol.arrowHead(
                                    {pixelSize: 7, polygon: false, pathOptions: {stroke: true}})}
                        ]});

                        arrowLayer.addTo(map);

                        
			knownWays[feature.properties.objectId] = feature;
                        
			(function(layer, props) {
				layer.on("mouseover", function(e) {
					layer.setStyle({
						color : "#ffff00"
					});
				});

				layer.on("mouseout", function(e) {
					layer.setStyle(props.style);
				});

				if (options.mobile) {
					layer.on("click", function(e) {
						$('body').append(createEditorPopup(props));
						addTypeAheadFields(props.objectId);
					});
				}

			})(layer, feature.properties);

			if (!options.mobile) {
				if (feature.properties && feature.properties.objectId) {
					layer.bindPopup(createEditorPopup(feature.properties), {
						objectId : feature.properties.objectId
					});
				}
			}
		}
	}
);

geojsonLayer.addTo(map);


var overlayLayers = {
	"Objects" : geojsonLayer
};

map.addControl(new L.Control.Layers(baseLayers, overlayLayers));


function createField(field, fieldId, data) {
	var elem = $();
	var value = data[field.name] ? data[field.name] : "";
	if (field.type == "text") {
		elem = $('<input type="text" class="input-medium" autocomplete="off" data-provide="typeahad" />');
		elem.attr('value', value);
	} else if (field.type == "textarea") {
		elem = $('<textarea style="height:200px" class="span3" />');
		elem.attr('value', value);
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
			var option = $('<option />');
			option.attr('value', value);
			option.text(value);
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
	var label = $('<label class="control-label" for="' + fieldId + '" />');
	var labelValue = currentField.labelCode ? MSG[currentField.labelCode] : currentField.label;
	label.text(labelValue + ':');
	field.append(label);
	field.append(createField(currentField, fieldId, props.tags));
	return field;
}

function createEditorPopup(props) {
	var elem = (options.mobile) ? $('<div id="fullScreenEditor" style="position:absolute;left:0;top:0;width:100%;height:100%;background-color:white;z-index:100" />')
			: $('<div style="margin:10px;width:300px;" />');

	elem.append('<h6><a href="http://www.openstreetmap.org/browse/way/' + props.objectId
			+ '" target="osmWay">Way ID ' + props.objectId + '</a></h6>');

	var form = $('<form class="form-horizontal" />');
	form.attr("id", "form_" + props.objectId);
	form.append('<input type="hidden" name="objectId" value="' + props.objectId + '" />');

	var fields = templates[props.objectType];
	var requiredFields = [];
	var fieldset = $('<fieldset />');
	fieldset.append('<h6>'+MSG.title_change_properties+'</h6>');

	var fieldsetDiv = (options.mobile) ? $('<div class="fieldset-fields" style="overflow-y:scroll;left:5px;right:0px;position:absolute;bottom:60px;top:40px" />')
			: $('<div class="fieldset-fields" style="max-height:280px;overflow-y:scroll;margin-bottom:5px" />');
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
	var bottomBar = options.mobile ? $('<div class="modal-footer" style="position:absolute;height:30px;bottom: 0px;left:0px;right:0px" />')
			: $('<div style="margin-top:5px" />');
	bottomBar
			.append('<button type="button" class="btn btn-small btn-primary" onclick="saveWay(this.form);">'
					+ MSG.button_save + '</button>&nbsp;');
	bottomBar
			.append('<button type="button" class="btn btn-small" onclick="cancelPopup(this.form);">'
					+ MSG.button_cancel + '</button>&nbsp;');
	bottomBar
			.append('<button type="button" class="btn btn-small" onclick="addTag(this.form);" title="'
					+ MSG.button_add_tag_title + '">' + MSG.button_add_tag + '</button>&nbsp;');
	if (!options.mobile) {
		bottomBar.append('<button type="button" class="btn btn-small" onclick="selectWay('
				+ props.objectId + ');" title="' + MSG.button_josm_title + '">' + MSG.button_josm
				+ '</button>');
	}

	form.append(bottomBar);
	elem.append(form);
	return $('<div class="modal-body" />').html(elem).html();
}

function cancelPopup(form) {
	var objectId = $(form).find("[name=objectId]").val();
	var knownWay = knownWays[objectId];
	if (options.mobile)
		$('#fullScreenEditor').remove();
	else
		map.closePopup(knownWay.layer._popup);
}

function addTag(form) {
	var tag = prompt(MSG.prompt_tag_name);
	if (tag) {
		var currentField = {
			name : tag,
			label : tag,
			type : "text"
		};
		var elem = createFieldElement(new Date().getTime(), currentField, {
			tags : {}
		});
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

		if (options.mobile)
			$('#fullScreenEditor').remove();
		else
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
			showMessageBox(MSG.warn_no_changes);
		} else {
			var token = localStorage.getItem('token');
			var secret = localStorage.getItem('secret');

			var model = {};
			model["ways"] = pendingWays;
			model["comment"] = prompt(MSG.prompt_changeset, "");
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
						showMessageBox(MSG.info_upload_successful);
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
		showMessageBox(MSG.warn_zoom + " (" + map.getZoom() + ")");

	} else {

		if ($.isEmptyObject(pendingWays) || confirm(MSG.warn_unsaved_changes)) {

			clearPendingWays();
			knownWays = {};
			geojsonLayer.clearLayers();
			var bounds = map.getBounds();
			var sw = bounds.getSouthWest();
			var ne = bounds.getNorthEast();
			var params = "west=" + sw.lng + "&north=" + ne.lat + "&east=" + ne.lng + "&south="
					+ sw.lat;

			var options = $('#options').serialize();
			params += "&" + options;

			$.ajax({
				url : 'downloadData?' + params,
				dataType : 'json',
				error : function(event, xhr, options, exc) {
					alert(MSG.error + ": " + event.statusText + "\n\n" + MSG.error_download);
				},
				success : function(data) {
					if (data.geometry.features && data.geometry.features.length) {
						support = data.support;
						geojsonLayer.addData(data.geometry);
						showMessageBox(data.geometry.features.length + " " + MSG.objects_found);
						localStorage.setItem("lastData", JSON.stringify(data));
					} else
						alert(MSG.info_no_object_found);
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
			alert(MSG.error + ": " + event.statusText + "\n\n\n" + MSG.error_josm);
		},
		scusss : function(result, text) {
			if (text != "success")
				showMessageBox("[" + result + "]");
		}
	});

}

function addTypeAheadFields(objectId) {
	$('#form_' + objectId).find(':input').each(function() {
		var elem = $(this);
		var name = $(this).attr("name");
		if (support[name]) {
			elem.typeahead({
				'source' : support[name]
			});
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
	addTypeAheadFields(objectId);
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
		alert(MSG.error_no_tokens);
		return false;
	}
}

function clearOauth() {
	localStorage.removeItem("token");
	localStorage.removeItem("secret");
	localStorage.removeItem("username");
	showMessageBox(MSG.info_tokens_deleted);
	initEditor(options);
}

function initEditor(newOptions) {
	$.extend(options, newOptions);
	if (window.localStorage) {
		var myMsg = "";
		if (options.token != '') {
			localStorage.setItem("token", options.token);
			localStorage.setItem("secret", options.secret);
			localStorage.setItem("username", options.username ? options.username : "unknown");
			myMsg += MSG.info_tokens_received;

		} else if (localStorage.getItem('token') && localStorage.getItem('secret')) {
			myMsg += MSG.info_tokens_available;
		}

		options.username = localStorage.getItem('username');

		if (options.username && options.username != '') {
			$('#loginLabel').html(
					'<a href="oauthRequest"><i class="icon-user icon-white"></i><span class="visible-desktop">&nbsp;<b>' + options.username + '</b></span></a>');
			$('#logoutLabel').show();
		} else {
			$('#loginLabel').html('<a href="oauthRequest"><i class="icon-user icon-white"></i><span class="visible-desktop">&nbsp;<b>' + MSG.menu_login + '</b></span></a>');
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
			if (lastData.geometry) {
				support = lastData.support;
				geojsonLayer.addData(lastData.geometry);
				if (myMsg != "")
					myMsg += "<br>";
				myMsg += lastData.geometry.features.length + " " + MSG.objects_found;
			}
		}

		$('#options :radio').on('change', function() {
			downloadData();
		});

		if (myMsg != "")
			showMessageBox(myMsg);

	} else {
		alert(MSG.warn_no_localstorage);
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
					alert(MSG.error_geo_no_access);
				} else if (error.code == 2) {
					alert(MSG.error_geo_no_position);
				} else if (error.core == 3) {
					alert(MSG.error_geo_timeout);
				}
			}, {
				timeout : 120000,
				enableHighAccuracy : true
			});
		} else
			alert(MSG.error_geo_no_api);
	}

};

$('.modal').modal({
	show : false
});