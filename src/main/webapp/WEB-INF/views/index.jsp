<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<html>
<head>
<title>OSM QA Editor</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<!-- Leaflet CSS -->
<link rel="stylesheet" href="rs/leaflet/leaflet.css" />
<!--[if lte IE 8]><link rel="stylesheet" href="<path_to_dist>/leaflet.ie.css" /><![endif]-->
<!-- Le styles -->
<link href="rs/bootstrap/css/bootstrap.css" rel="stylesheet">
<link href="rs/bootstrap/css/bootstrap-responsive.css" rel="stylesheet">
<link href="rs/tracks.css" rel="stylesheet">
<style>
html,body {
	height: 100%;
	margin: 0px;
}

form {
	margin: 0px;
}

.modal {
	max-height: 800px !important;
}

#messageBox {
	position: relative;
	margin-left: auto;
	margin-right: auto;
	width: 250px;
	background-color: white;
	text-align: center;
	top: 10px;
}

.leaflet-control-layers-list input {
	display: inline !important;
}

.form-horizontal .control-label {
	width: 100px !important;
	overflow: hidden;
}

.form-horizontal .control-group {
	margin-bottom: 9px;
}

.form-horizontal .controls {
	margin-left: 110px;
}
</style>

<!-- Leaflet JavaScript -->
<script src="rs/leaflet/leaflet-src.js"></script>
<script src="rs/jquery-1.7.2.min.js"></script>
<script src="rs/bootstrap/js/bootstrap.js"></script>
</head>
<body>
	<div style="height: 100%; position: relative;">
		<div class="navbar navbar-fixed-top" style="position: fixed; z-index: 10000; margin-bottom: 0px">
			<div class="navbar-inner">
				<div class="container">
					<a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse"> <span class="icon-bar"></span> <span
						class="icon-bar"></span> <span class="icon-bar"></span>
					</a> <a class="brand" href="#">OSM QA Editor</a>
					<ul class="nav">
						<li><a href="#" onclick="downloadData();"><i class="icon-download icon-white"></i><span
								class="visible-desktop">&nbsp;Download OSM Data</span></a></li>
						<li><a href="#" onclick="uploadChanges();"><i class="icon-upload icon-white"></i><span
								class="visible-desktop">&nbsp;Upload changes</span><span id="changesSpan"></span></a></li>
						<li><a href="#" onclick="Location.findMe();"><i class="icon-screenshot icon-white"></i><span
								class="visible-desktop">&nbsp;Locate me</span></a></li>
					</ul>
					<ul class="nav pull-right">
						<li id="loginLabel"><a href="oauthRequest">Login</a></li>
						<li id="logoutLabel" style="display: none"><a href="#" onclick="clearOauth();">Logout</a></li>
						<li><a data-toggle="modal" href="#aboutDialog">About</a></li>
					</ul>
					<div class="nav-collapse">
						<form id="options">
							<ul class="nav">
								<li class="dropdown"><a data-toggle="dropdown" class="dropdown-toggle" href="#">Options <b
										class="caret"></b></a>
									<ul class="dropdown-menu">
										<li><a href="#"><label><input style="display: inline" type="checkbox" checked="checked"
													value="true" name="overpass">&nbsp; Use Overpass API</label></a></li>
										<li class="divider"></li>
										<li><a href="#"><label><input style="display: inline" type="radio" name="template"
													value="noTracktype" checked="checked">&nbsp;Show tracks without surface</label></a></li>
										<li><a href="#"><label><input style="display: inline" type="radio" name="template"
													value="noSurface">&nbsp;Show tracks without surface</label></a></li>
										<li><a href="#"><label><input style="display: inline" type="radio" name="template"
													value="noAddress">&nbsp;Show buildings without address</label></a></li>
									</ul></li>
							</ul>
						</form>
					</div>

				</div>
			</div>
			<div id="loading" style="display: none" class="alert"></div>
			<div id="messageBox" style="display: none" class="alert alert-info">
				<button class="close" data-dismiss="alert">×</button>
				<span>Hello</span>
			</div>
		</div>
		<div class="container-fluid" style="height: 100%; position: relative;">
			<div id="map" style="position: absolute; left: 5px; right: 5px; bottom: 5px; top: 40px;"></div>
		</div>


	</div>
	<div class="modal" id="aboutDialog" style="display: none">
		<div class="modal-header">
			<button class="close" data-dismiss="modal">×</button>
			<h3>About OSM QA Editor</h3>
		</div>
		<div class="modal-body">
			<p>
				This tool will download and show you different problematic objects, like tracks <b>without a <a
					href="http://wiki.openstreetmap.org/wiki/Key:tracktype" target="_blank">tracktype tag</a></b> or buildings without an
				address in the current view . After data download click on a colored object to see the details and modify them.
			</p>
			<p>To edit objects in this editor please press the login button and authorize the QA Editor to be able to edit
				ways unter your OSM username.</p>
			<p>
				<strong>Note:</strong> the access tokens will be stored in your current browser. Do not use this function on a
				public computer or at least delete the tokens by pressing the "Logout" button.
			</p>
			<p>You can also use JOSM to edit objects. Press the "open in JOSM" button for that. Please download the same area
				in JOSM first.</p>

			<p>
				The QA Editor downloads objects via <a href="http://www.overpass-api.de" target="_blank">Openpass API</a> by
				default. Please note that this API is some minutes behind the OSM server. If you download the same region after
				having uploaded your changes you might see that the objects are still unchanged. Please wait a few minutes or disable
				the Overpass API in the options menu in this case.
			</p>
			<p>
				Created by <a href="http://www.openstreetmap.org/user/nitegate">nitegate</a> (<a href="http://www.grundid.de">GrundID
					GmbH</a>), Data by <a href="http://www.openstreetmap.org">OpenStreetMap contributors</a>.
			</p>
			<p>Powered by Leaflet, Bootstrap, jQuery, osm-tools. Source code at: <a href="https://github.com/grundid/tracks-editor">GitHub</a>.
		</div>
		<div class="modal-footer">
			<a href="#" class="btn" onclick="$('#aboutDialog').modal('hide');">Close</a>
		</div>
	</div>
	<div id="dialogContainer"></div>
	<script src="rs/tracks-editor.js"></script>
	<script type="text/javascript">
		updateOauth('${oauthTokens.token}', '${oauthTokens.tokenSecret}', '${osmUser.displayName}');
	</script>
</body>
</html>
