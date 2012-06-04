package org.osmsurround.selective.template;

import java.util.Set;
import java.util.TreeSet;

import org.osm.schema.Osm;
import org.osm.schema.OsmTag;
import org.osm.schema.OsmWay;
import org.osmsurround.selective.data.DownloadDataResponse;
import org.osmsurround.selective.data.SearchConfig;
import org.osmtools.api.BoundingBox;
import org.osmtools.geojson.Geometry;
import org.springframework.stereotype.Service;

@Service
public class NoNameResidentialDataConverter extends AbstractDataConverter {

	@Override
	public boolean canHandle(SearchConfig searchConfig) {
		return "noNameResidential".equals(searchConfig.getTemplate());
	}

	@Override
	public DownloadDataResponse convert(BoundingBox boundingBox, SearchConfig searchConfig) {
		String data = "(way[highway=residential](" + boundingBox.getSouth() + "," + boundingBox.getWest() + ","
				+ boundingBox.getNorth() + "," + boundingBox.getEast() + ");node(w)->.x;);out meta;";

		Osm osm = searchConfig.isUseOverpass() ? overpassTemplate.getRaw(data) : osmTemplate.getBBox(boundingBox);
		ConverterContext context = new ConverterContext(osm, "noname", searchConfig);
		context.setSupport("name", new TreeSet<String>());
		return createDataResponse(context);
	}

	@Override
	protected boolean useObject(OsmWay osmWay, ConverterContext context) {
		boolean hasName = false;
		Set<String> names = (Set<String>)context.getSupport().get("name");
		for (OsmTag tag : osmWay.getTag()) {
			if (tag.getK().equals("name")) {
				hasName = true;
				names.add(tag.getV());
			}
		}
		return !hasName;
	}

	@Override
	protected Geometry convertObjectToGeometry(OsmWay osmWay, ConverterContext context) {
		return context.createLineString(osmWay);
	}

}
