package org.osmsurround.selective.template;

import org.osmsurround.selective.data.SearchConfig;
import org.osmtools.api.BoundingBox;
import org.osmtools.geojson.FeatureCollection;

public interface OsmDataConverter {

	boolean canHandle(SearchConfig searchConfig);

	FeatureCollection convert(BoundingBox boundingBox, SearchConfig searchConfig);

}
