package org.osmsurround.selective.template;

import java.util.HashMap;
import java.util.Map;

import org.geojson.Feature;
import org.geojson.FeatureCollection;
import org.geojson.GeoJsonObject;
import org.osm.schema.OsmTag;
import org.osm.schema.OsmWay;
import org.osmsurround.selective.data.DownloadDataResponse;
import org.osmsurround.selective.data.LeafletStyle;
import org.osmtools.api.OsmOperations;
import org.osmtools.overpass.OverpassTemplate;
import org.springframework.beans.factory.annotation.Autowired;

public abstract class AbstractDataConverter implements OsmDataConverter {

	@Autowired
	protected OsmOperations osmTemplate;
	@Autowired
	protected OverpassTemplate overpassTemplate;
	//	private String[] colors = { "#800000", "#FF0000", "#800080", "#FF00FF", "#000000", "#808080", "#008000", "#00FF00",
	//			"#808000", "#FFFF00", "#000080", "#0000FF", "#008080", "#00FFFF", "#C0C0C0", "#FFFFFF"
	protected String[] colors = { "#FF0000" };

	protected abstract boolean useObject(OsmWay osmWay, ConverterContext context);

	protected abstract GeoJsonObject convertObjectToGeometry(OsmWay osmWay, ConverterContext context);

	protected DownloadDataResponse createDataResponse(ConverterContext context) {
		FeatureCollection featureCollection = filterObjects(context);
		DownloadDataResponse response = new DownloadDataResponse(featureCollection);
		response.setSupport(context.getSupport());
		return response;
	}

	protected FeatureCollection filterObjects(ConverterContext context) {
		FeatureCollection featureCollection = new FeatureCollection();
		int colorIndex = 0;
		for (OsmWay osmWay : context.getOsm().getWay()) {
			if (useObject(osmWay, context)) {
				Feature feature = new Feature();
				Map<String, String> tags = new HashMap<String, String>();
				for (OsmTag tag : osmWay.getTag()) {
					tags.put(tag.getK(), tag.getV());
				}
				feature.setProperty("tags", tags);
				feature.setProperty("objectId", osmWay.getId());
				feature.setProperty("objectType", context.getObjectType());
				feature.setProperty("style", new LeafletStyle(colors[colorIndex]));
				colorIndex = (colorIndex + 1) % colors.length;
				feature.setGeometry(convertObjectToGeometry(osmWay, context));
				featureCollection.add(feature);
			}
		}
		return featureCollection;
	}
}
