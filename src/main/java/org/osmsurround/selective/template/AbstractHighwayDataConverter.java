package org.osmsurround.selective.template;

import org.geojson.GeoJsonObject;
import org.osm.schema.Osm;
import org.osm.schema.OsmTag;
import org.osm.schema.OsmWay;
import org.osmsurround.selective.data.DownloadDataResponse;
import org.osmsurround.selective.data.SearchConfig;
import org.osmsurround.selective.data.WayFeatures;
import org.osmtools.api.BoundingBox;

public abstract class AbstractHighwayDataConverter extends AbstractDataConverter {

	protected abstract boolean decideWay(WayFeatures wayFeatures, SearchConfig searchConfig);

	@Override
	public DownloadDataResponse convert(BoundingBox boundingBox, SearchConfig searchConfig) {
		
		
		String data = "(way(" + boundingBox.getSouth() + "," + boundingBox.getWest() + "," + boundingBox.getNorth() + "," + boundingBox.getEast() + ");node(w)->.x;);out meta;";
		Osm osm = searchConfig.isUseOverpass() ? overpassTemplate.getRaw(data) : osmTemplate.getBBox(boundingBox);
		ConverterContext context = new ConverterContext(osm, "highway", searchConfig);
		return createDataResponse(context);
	}

	@Override
	protected boolean useObject(OsmWay osmWay, ConverterContext context) {
		WayFeatures wayFeatures = new WayFeatures();
		for (OsmTag tag : osmWay.getTag()) {
			if (tag.getK().equals("highway")) {
				if (
						tag.getV().equals("primary") ||
						tag.getV().equals("primary_link") ||
						tag.getV().equals("secondary") ||
						tag.getV().equals("secondary_link") ||
						tag.getV().equals("tertiary") ||
						tag.getV().equals("tertiary_link") ||
						tag.getV().equals("service") ||
						tag.getV().equals("residential") ||
						tag.getV().equals("unclassified") ||						
						tag.getV().equals("living_street")
					) {
					wayFeatures.setHighwayStreet();
				}
				wayFeatures.setHighway();
			}
			if (tag.getK().startsWith("footway") || tag.getK().startsWith("sidewalk"))
				wayFeatures.setSidewalk();
			if (tag.getK().contains("incline"))
				wayFeatures.setIncline();
			if (tag.getK().contains("smoothness"))
				wayFeatures.setSmoothness();
			if (tag.getK().contains("surface"))
				wayFeatures.setSurface();
		}
		return decideWay(wayFeatures, context.getSearchConfig());
	}

	@Override
	protected GeoJsonObject convertObjectToGeometry(OsmWay osmWay, ConverterContext context) {
		return context.createLineString(osmWay);
	}
}
