<html>
<head>
<!-- Leaflet CSS --> 
<link rel="stylesheet" href="rs/leaflet/leaflet.css" />
<!--[if lte IE 8]><link rel="stylesheet" href="<path_to_dist>/leaflet.ie.css" /><![endif]-->

<!-- Leaflet JavaScript -->
<script src="rs/leaflet/leaflet-src.js"></script>
<script src="rs/jquery-1.7.2.min.js"></script>
<script src="rs/geojsondata.js"></script>
<style>
html,body {
	height: 100%;
	margin: 0px;
	font-family: sans-serif;
}
#map {
bottom: 5px;
left: 5px;
position: absolute;
right: 5px;
top: 5px;
}
</style>
</head>
<body>
<div style="height:100%;">
<div style="height:48px">
<div style="padding:5px;">
	<div style="font-weight:bold;width:125px;float:left">OSM<br>Tracks Selector</div>
	<div style="font-size:11px;width:440px;float:left">This tool will download and show you all the 
	<b>tracks</b> in the current view <b>without a <a href="http://wiki.openstreetmap.org/wiki/Key:tracktype" target="_blank">tracktype tag</a></b>.
	After data download click on a colored way and select the Way ID to open this way in JOSM. 
	Please download the same area in JOSM first. Created by <a href="http://www.openstreetmap.org/user/nitegate">nitegate</a>, Data by OSM.
	</div>
	<div style="float:left;margin-left:10px"><input type="button" id="downloadButton" onclick="downloadData();" value="Download OSM data">
	<span style="font-size:11px;">Preselect tracktype:</span> <select id="tracktype"><option>none</option><option>grade1</option><option>grade2</option><option>grade3</option><option>grade4</option><option>grade5</option>
	</select><br>
	<label style="font-size:11px;"><input type="checkbox" value="true" id="withoutSurface">show tracks <b>without surface tag</b></label>
	<label style="font-size:11px;" title="uncheck this if you want to download data directly from the OSM server"><input type="checkbox" checked="checked" value="true" id="useOverpass">use Overpass API</label>
	</div>
	<div id="loader" style="float:left;width:32px;margin-left:10px;display:none"><img src="rs/ajax-loader.gif"></div>
	
</div>
</div>
<div style="position:absolute;top:48px;left:0px;right:0px;bottom:0px">
<div id="map"></div>
</div>
</div>

<script src="rs/selective-editor.js"></script>
</body>
</html>
