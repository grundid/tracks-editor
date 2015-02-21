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
		String data = "(way(" + boundingBox.getSouth() + "," + boundingBox.getWest() + "," + boundingBox.getNorth()
				+ "," + boundingBox.getEast() + ");node(w)->.x;);out meta;";
		Osm osm = searchConfig.isUseOverpass() ? overpassTemplate.getRaw(data) : osmTemplate
				.getBBox(boundingBox);
		ConverterContext context = new ConverterContext(osm, "highway", searchConfig);
		return createDataResponse(context);
	}

	@Override
	protected boolean useObject(OsmWay osmWay, ConverterContext context) {
		WayFeatures wayFeatures = new WayFeatures();
		for (OsmTag tag : osmWay.getTag()) {
			if (tag.getK().equals("highway"))
				wayFeatures.setHighway();
			// if (tag.getK().equals("sidewalk"))
			if (tag.getK().startsWith("footway"))
				wayFeatures.setSidewalk();
		}
		return decideWay(wayFeatures, context.getSearchConfig());
	}

	@Override
	protected GeoJsonObject convertObjectToGeometry(OsmWay osmWay, ConverterContext context) {
		return context.createLineString(osmWay);
	}
}
