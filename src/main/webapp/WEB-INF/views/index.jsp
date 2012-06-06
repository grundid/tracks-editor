<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<html>
<head>
<title><spring:message code="app.name" /></title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="shortcut icon" href="favicon.ico" />
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
<script src="rs/messages-${currentLocaleLanguage}.js"></script>
<script src="rs/templates.js"></script>
</head>
<body>
	<div style="height: 100%; position: relative;">
		<div class="navbar navbar-fixed-top" style="position: fixed; z-index: 10000; margin-bottom: 0px">
			<div class="navbar-inner">
				<div class="container">
					<a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse"> <span class="icon-bar"></span> <span
						class="icon-bar"></span> <span class="icon-bar"></span>
					</a> <a class="brand" href="#"><spring:message code="app.name" /></a>
					<ul class="nav">
						<li><a href="#" onclick="downloadData();"><i class="icon-download icon-white"></i><span
								class="visible-desktop">&nbsp;<spring:message code="menu.download.data" /></span></a></li>
						<li><a href="#" onclick="uploadChanges();"><i class="icon-upload icon-white"></i><span
								class="visible-desktop">&nbsp;<spring:message code="menu.upload.changes" /></span><span id="changesSpan"></span></a></li>
						<li><a href="#" onclick="Location.findMe();"><i class="icon-screenshot icon-white"></i><span
								class="visible-desktop">&nbsp;<spring:message code="menu.locate.me" /></span></a></li>
					</ul>
					<ul class="nav pull-right">
						<li id="loginLabel"><a href="oauthRequest"><spring:message code="menu.login" /></a></li>
						<li id="logoutLabel" style="display: none"><a href="#" onclick="clearOauth();"><spring:message code="menu.logout" /></a></li>
						<li><a data-toggle="modal" href="#aboutDialog"><spring:message code="menu.about" /></a></li>
					</ul>
					<div class="nav-collapse">
						<form id="options">
							<ul class="nav">
								<li class="dropdown"><a data-toggle="dropdown" class="dropdown-toggle" href="#"><spring:message code="menu.options" /> <b
										class="caret"></b></a>
									<ul class="dropdown-menu">
										<li><a href="#"><label><input style="display: inline" type="checkbox" checked="checked"
													value="true" name="overpass">&nbsp;<spring:message code="options.overpass" /></label></a></li>
										<li class="divider"></li>
										<li><a href="#"><label><input style="display: inline" type="radio" name="template"
													value="noTracktype" checked="checked">&nbsp;<spring:message code="options.notracktype" /></label></a></li>
										<li><a href="#"><label><input style="display: inline" type="radio" name="template"
													value="noSurface">&nbsp;<spring:message code="options.nosurface" /></label></a></li>
										<li><a href="#"><label><input style="display: inline" type="radio" name="template"
													value="noAddress">&nbsp;<spring:message code="options.noaddress" /></label></a></li>
										<li><a href="#"><label><input style="display: inline" type="radio" name="template"
													value="noNameResidential">&nbsp;<spring:message code="options.nonameresidential" /></label></a></li>
									</ul></li>
							</ul>
						</form>
					</div>

				</div>
			</div>
			<div id="loading" style="display: none" class="alert"></div>
			<div id="messageBox" style="display: none" class="alert alert-info">
				<button class="close" data-dismiss="alert">×</button>
				<span></span>
			</div>
		</div>
		<div class="container-fluid" style="height: 100%; position: relative;">
			<div id="map" style="position: absolute; left: 5px; right: 5px; bottom: 5px; top: 40px;"></div>
		</div>


	</div>
	<div class="modal" id="aboutDialog" style="display: none">
		<div class="modal-header">
			<button class="close" data-dismiss="modal">×</button>
			<h3><spring:message code="about.title" /></h3>
		</div>
		<div class="modal-body">
		<spring:message code="about.content" htmlEscape="false" />
		</div>
		<div class="modal-footer">
			<a href="#" class="btn" onclick="$('#aboutDialog').modal('hide');"><spring:message code="about.close.button" /></a>
		</div>
	</div>
	<div id="dialogContainer"></div>
	<script src="rs/tracks-editor.js"></script>
	<script type="text/javascript">
		updateOauth('${oauthTokens.token}', '${oauthTokens.tokenSecret}', '${osmUser.displayName}');
	</script>
</body>
</html>
