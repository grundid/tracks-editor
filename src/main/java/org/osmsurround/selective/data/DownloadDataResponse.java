package org.osmsurround.selective.data;

import java.util.HashMap;
import java.util.Map;

import org.osmtools.geojson.Geometry;

public class DownloadDataResponse {

	private Geometry geometry;
	private Map<String, Object> support = new HashMap<String, Object>();

	public DownloadDataResponse(Geometry geometry) {
		this.geometry = geometry;
	}

	public Geometry getGeometry() {
		return geometry;
	}

	public Map<String, Object> getSupport() {
		return support;
	}

	public void setSupport(Map<String, Object> support) {
		this.support = support;
	}

}
