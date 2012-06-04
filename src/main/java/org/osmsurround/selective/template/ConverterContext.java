package org.osmsurround.selective.template;

import java.math.BigInteger;
import java.util.HashMap;
import java.util.Map;

import org.osm.schema.Osm;
import org.osm.schema.OsmNd;
import org.osm.schema.OsmNode;
import org.osm.schema.OsmWay;
import org.osmsurround.selective.data.SearchConfig;
import org.osmtools.geojson.Geometry;
import org.osmtools.geojson.LineString;
import org.osmtools.geojson.Polygon;

public class ConverterContext {

	private Map<BigInteger, OsmNode> nodes = new HashMap<BigInteger, OsmNode>();
	private Osm osm;
	private String objectType;
	private SearchConfig searchConfig;

	private Map<String, Object> support = new HashMap<String, Object>();

	public ConverterContext(Osm osm, String objectType, SearchConfig searchConfig) {
		this.osm = osm;
		this.objectType = objectType;
		this.searchConfig = searchConfig;
		for (OsmNode node : osm.getNode()) {
			nodes.put(node.getId(), node);
		}
	}

	public Geometry createPolygon(OsmWay osmWay) {
		Polygon geometry = new Polygon();
		for (OsmNd nd : osmWay.getNd()) {
			OsmNode node = nodes.get(nd.getRef());
			geometry.addCoordinates(node.getLon(), node.getLat());
		}
		return geometry;
	}

	public Geometry createLineString(OsmWay osmWay) {
		LineString geometry = new LineString();
		for (OsmNd nd : osmWay.getNd()) {
			OsmNode node = nodes.get(nd.getRef());
			geometry.addCoordinates(node.getLon(), node.getLat());
		}
		return geometry;
	}

	public Osm getOsm() {
		return osm;
	}

	public String getObjectType() {
		return objectType;
	}

	public SearchConfig getSearchConfig() {
		return searchConfig;
	}

	public Map<String, Object> getSupport() {
		return support;
	}

	public void setSupport(String key, Object object) {
		this.support.put(key, object);
	}
}
