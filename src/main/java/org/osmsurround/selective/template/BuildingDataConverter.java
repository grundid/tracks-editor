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
		String data = "(way(" + boundingBox.getSouth() + "," + boundingBox.getWest() + "," + boundingBox.getNorth()
				+ "," + boundingBox.getEast() + ");node(w)->.x;);out meta;";

		Osm osm = searchConfig.isUseOverpass() ? overpassTemplate.getRaw(data) : osmTemplate.getBBox(boundingBox);
		ConverterContext context = new ConverterContext(osm, "building", searchConfig);
		prepareContext(context);
		return createDataResponse(context);
	}

	protected void prepareContext(ConverterContext context) {
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
