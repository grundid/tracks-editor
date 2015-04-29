package org.osmsurround.selective.template;

import org.osmsurround.selective.data.SearchConfig;
import org.osmsurround.selective.data.WayFeatures;
import org.springframework.stereotype.Service;

@Service
public class NoSurfaceHighwayDataConverter extends AbstractHighwayDataConverter {


		@Override
		public boolean canHandle(SearchConfig searchConfig) {
			return "noSurfaceHighway".equals(searchConfig.getTemplate());
		}

		@Override
		protected boolean decideWay(WayFeatures wayFeatures, SearchConfig searchConfig) {
			if (wayFeatures.isHighway() && !wayFeatures.isSurface()) {
				return true;
			}
			return false;
		}

	
}
