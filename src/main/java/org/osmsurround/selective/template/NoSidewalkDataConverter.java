package org.osmsurround.selective.template;

import org.osmsurround.selective.data.SearchConfig;
import org.osmsurround.selective.data.WayFeatures;
import org.springframework.stereotype.Service;

@Service
public class NoSidewalkDataConverter extends AbstractHighwayDataConverter {

	@Override
	public boolean canHandle(SearchConfig searchConfig) {
		return "noSidewalk".equals(searchConfig.getTemplate());
	}

	@Override
	protected boolean decideWay(WayFeatures wayFeatures, SearchConfig searchConfig) {
		if (wayFeatures.isHighwayStreet() && !wayFeatures.hasSidewalk()) {
			return true;
		}
		return false;
	}
}
