package org.osmsurround.selective.data;

import java.util.HashMap;
import java.util.Map;

import org.geojson.GeoJsonObject;

public class DownloadDataResponse {

	private GeoJsonObject geometry;
	private Map<String, Object> support = new HashMap<String, Object>();

	public DownloadDataResponse(GeoJsonObject geometry) {
		this.geometry = geometry;
	}

	public GeoJsonObject getGeometry() {
		return geometry;
	}

	public Map<String, Object> getSupport() {
		return support;
	}

	public void setSupport(Map<String, Object> support) {
		this.support = support;
	}
}
