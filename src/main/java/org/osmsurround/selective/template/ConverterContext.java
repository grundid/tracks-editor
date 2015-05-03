package org.osmsurround.selective.template;

import org.geojson.GeoJsonObject;
import org.geojson.LineString;
import org.geojson.LngLatAlt;
import org.geojson.Polygon;
import org.osm.schema.Osm;
import org.osm.schema.OsmNd;
import org.osm.schema.OsmNode;
import org.osm.schema.OsmWay;
import org.osmsurround.selective.data.SearchConfig;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

	public GeoJsonObject createPolygon(OsmWay osmWay) {
		Polygon geometry = new Polygon();
		geometry.add(createPoints(osmWay));
		return geometry;
	}

	public GeoJsonObject createLineString(OsmWay osmWay) {
		LineString lineString = new LineString();
		lineString.setCoordinates(createPoints(osmWay));
		return lineString;
	}

	private List<LngLatAlt> createPoints(OsmWay osmWay) {
		List<LngLatAlt> points = new ArrayList<LngLatAlt>();
		for (OsmNd nd : osmWay.getNd()) {
			OsmNode node = nodes.get(nd.getRef());
			points.add(new LngLatAlt(node.getLon(), node.getLat()));
		}
		return points;
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

	public OsmNode getNode(BigInteger id) {
		return nodes.get(id);
	}
}
