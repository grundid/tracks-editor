package org.osmsurround.selective.template;

import org.osm.schema.OsmTag;
import org.osm.schema.OsmWay;
import org.osmsurround.selective.data.SearchConfig;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.TreeSet;

@Service
public class NoAddressBuildingDataConverter extends BuildingDataConverter {

	@Override
	public boolean canHandle(SearchConfig searchConfig) {
		return "noAddress".equals(searchConfig.getTemplate());
	}

	@Override
	protected void prepareContext(ConverterContext context) {
		context.setSupport("addr:street", new TreeSet<String>());
	}

	@Override
	protected boolean useObject(OsmWay osmWay, ConverterContext context) {
		String streetName = null;
		boolean isHighway = false;
		for (OsmTag tag : osmWay.getTag()) {
			if (tag.getK().equals("name")) {
				streetName = tag.getV();
			}
			if (tag.getK().equals("highway")) {
				isHighway = true;
			}
			if (tag.getK().equals("building") && !isGarage(tag.getV()))
				return !hasValidAddress(osmWay.getTag());
		}
		if (isHighway && streetName != null) {
			Set<String> streetNames = (Set<String>)context.getSupport().get("addr:street");
			streetNames.add(streetName);
		}
		return false;
	}

	private boolean isGarage(String value) {
		return "garage".equals(value) | "garages".equals(value);
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
