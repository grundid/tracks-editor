package org.osmsurround.selective.template;

import org.osm.schema.Osm;
import org.osm.schema.OsmTag;
import org.osm.schema.OsmWay;
import org.osmsurround.selective.data.DownloadDataResponse;
import org.osmsurround.selective.data.SearchConfig;
import org.osmtools.api.BoundingBox;
import org.osmtools.geojson.Geometry;

public class BuildingDataConverter extends AbstractDataConverter {

	@Override
	public boolean canHandle(SearchConfig searchConfig) {
		return "buildings".equals(searchConfig.getTemplate());
	}

	@Override
	public DownloadDataResponse convert(BoundingBox boundingBox, SearchConfig searchConfig) {
		Osm osm = searchConfig.isUseOverpass() ? overpassTemplate.getBuildings(boundingBox) : osmTemplate
				.getBBox(boundingBox);
		ConverterContext context = new ConverterContext(osm, "building", searchConfig);
		return createDataResponse(context);
	}

	@Override
	protected boolean useObject(OsmWay osmWay, ConverterContext context) {
		for (OsmTag tag : osmWay.getTag()) {
			if (tag.getK().equals("building"))
				return true;
		}
		return false;
	}

	@Override
	protected Geometry convertObjectToGeometry(OsmWay osmWay, ConverterContext context) {
		return context.createPolygon(osmWay);
	}
}
