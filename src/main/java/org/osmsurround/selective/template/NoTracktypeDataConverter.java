package org.osmsurround.selective.template;

import org.osmsurround.selective.data.SearchConfig;
import org.osmsurround.selective.data.WayFeatures;
import org.springframework.stereotype.Service;

@Service
public class NoTracktypeDataConverter extends AbstractTrackDataConverter {

	@Override
	public boolean canHandle(SearchConfig searchConfig) {
		return "noTracktype".equals(searchConfig.getTemplate());
	}

	@Override
	protected boolean decideWay(WayFeatures wayFeatures, SearchConfig searchConfig) {
		if (wayFeatures.isHighwayTrack() && !wayFeatures.isGrade()) {
			return true;
		}
		return false;
	}
}
