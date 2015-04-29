package org.osmsurround.selective.template;

import org.osmsurround.selective.data.SearchConfig;
import org.osmsurround.selective.data.WayFeatures;
import org.springframework.stereotype.Service;

@Service
public class NoSurfaceDataConverter extends AbstractTrackDataConverter {

	@Override
	public boolean canHandle(SearchConfig searchConfig) {
		return "noSurface".equals(searchConfig.getTemplate());
	}

	@Override
	protected boolean decideWay(WayFeatures wayFeatures, SearchConfig searchConfig) {
		if (wayFeatures.isHighwayTrack() && !wayFeatures.isSurface()) {
			return true;
		}
		return false;
	}
}
