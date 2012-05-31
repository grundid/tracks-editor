package org.osmsurround.selective.data;

import java.math.BigInteger;
import java.util.HashMap;
import java.util.Map;

import org.osm.schema.Osm;
import org.osm.schema.OsmNd;
import org.osm.schema.OsmNode;
import org.osm.schema.OsmTag;
import org.osm.schema.OsmWay;
import org.osmsurround.api.BoundingBox;
import org.osmsurround.api.OsmTemplate;
import org.osmsurround.api.OverpassTemplate;
import org.osmsurround.geojson.Feature;
import org.osmsurround.geojson.FeatureCollection;
import org.osmsurround.geojson.LineString;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class DownloadService {

	@Autowired
	private OsmTemplate osmTemplate;
	@Autowired
	private RestTemplate restTemplate;

	private OverpassTemplate overpassTemplate;

	//	private String[] colors = { "#800000", "#FF0000", "#800080", "#FF00FF", "#000000", "#808080", "#008000", "#00FF00",
	//			"#808000", "#FFFF00", "#000080", "#0000FF", "#008080", "#00FFFF", "#C0C0C0", "#FFFFFF"
	private String[] colors = { "#FF0000" };

	public FeatureCollection downloadData(BoundingBox boundingBox, SearchConfig searchConfig) {
		overpassTemplate = new OverpassTemplate(restTemplate);
		Osm osm = searchConfig.isUseOverpass() ? overpassTemplate.getBBox(boundingBox) : osmTemplate
				.getBBox(boundingBox);

		Map<BigInteger, OsmNode> nodes = new HashMap<BigInteger, OsmNode>();

		for (OsmNode node : osm.getNode()) {
			nodes.put(node.getId(), node);
		}

		FeatureCollection featureCollection = new FeatureCollection();
		int colorIndex = 0;

		for (OsmWay osmWay : osm.getWay()) {
			boolean highwayTrack = false;
			boolean grade = false;
			boolean surface = false;
			for (OsmTag tag : osmWay.getTag()) {
				if (tag.getK().equals("highway") && tag.getV().equals("track"))
					highwayTrack = true;
				if (tag.getK().equals("tracktype") && tag.getV().startsWith("grade"))
					grade = true;
				if (tag.getK().equals("surface"))
					surface = true;
			}
			if (highwayTrack) {
				if ((!grade && !searchConfig.isWithoutSurface()) || (searchConfig.isWithoutSurface() && !surface)) {

					Feature feature = new Feature();

					Map<String, String> tags = new HashMap<String, String>();
					for (OsmTag tag : osmWay.getTag()) {
						tags.put(tag.getK(), tag.getV());
					}

					feature.setProperty("tags", tags);
					feature.setProperty("wayId", osmWay.getId());
					feature.setProperty("style", new LeafletStyle(colors[colorIndex]));
					colorIndex = (colorIndex + 1) % colors.length;

					LineString lineString = new LineString();
					for (OsmNd nd : osmWay.getNd()) {
						OsmNode node = nodes.get(nd.getRef());
						lineString.addCoordinates(node.getLon(), node.getLat());
					}
					feature.setGeometry(lineString);
					featureCollection.addFeature(feature);
				}
			}
		}

		return featureCollection;

	}

}
