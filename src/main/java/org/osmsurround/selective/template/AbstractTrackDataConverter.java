package org.osmsurround.selective.template;

import org.geojson.GeoJsonObject;
import org.osm.schema.Osm;
import org.osm.schema.OsmTag;
import org.osm.schema.OsmWay;
import org.osmsurround.selective.data.DownloadDataResponse;
import org.osmsurround.selective.data.SearchConfig;
import org.osmsurround.selective.data.WayFeatures;
import org.osmtools.api.BoundingBox;

public abstract class AbstractTrackDataConverter extends AbstractDataConverter {

	protected abstract boolean decideWay(WayFeatures wayFeatures, SearchConfig searchConfig);

	@Override
	public DownloadDataResponse convert(BoundingBox boundingBox, SearchConfig searchConfig) {
		Osm osm = searchConfig.isUseOverpass() ? overpassTemplate.getBBox(boundingBox) : osmTemplate
				.getBBox(boundingBox);
		ConverterContext context = new ConverterContext(osm, "track", searchConfig);
		return createDataResponse(context);
	}

	@Override
	protected boolean useObject(OsmWay osmWay, ConverterContext context) {
		WayFeatures wayFeatures = new WayFeatures();
		for (OsmTag tag : osmWay.getTag()) {
			if (tag.getK().equals("highway") && tag.getV().equals("track"))
				wayFeatures.setHighwayTrack();
			if (tag.getK().equals("tracktype") && tag.getV().startsWith("grade"))
				wayFeatures.setGrade();
			if (tag.getK().equals("surface"))
				wayFeatures.setSurface();
		}
		return decideWay(wayFeatures, context.getSearchConfig());
	}

	@Override
	protected GeoJsonObject convertObjectToGeometry(OsmWay osmWay, ConverterContext context) {
		return context.createLineString(osmWay);
	}
}
