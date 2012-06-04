package org.osmsurround.selective.template;

import org.osm.schema.OsmTag;
import org.osm.schema.OsmWay;
import org.osmsurround.selective.data.SearchConfig;
import org.springframework.stereotype.Service;

@Service
public class NoAddressBuildingDataConverter extends BuildingDataConverter {

	@Override
	public boolean canHandle(SearchConfig searchConfig) {
		return "noAddress".equals(searchConfig.getTemplate());
	}

	@Override
	protected boolean useObject(OsmWay osmWay, ConverterContext context) {
		for (OsmTag tag : osmWay.getTag()) {
			if (tag.getK().equals("building"))
				return !hasValidAddress(osmWay.getTag());
		}
		return false;
	}

	private boolean hasValidAddress(Iterable<OsmTag> tags) {
		boolean hasHousenumber = false;
		boolean hasStreet = false;

		for (OsmTag tag : tags) {
			if (tag.getK().equals("addr:housenumber"))
				hasHousenumber = true;
			if (tag.getK().equals("addr:street"))
				hasStreet = true;
		}

		return hasHousenumber && hasStreet;
	}

}
