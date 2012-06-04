package org.osmsurround.selective.template;

import org.osmsurround.selective.data.DownloadDataResponse;
import org.osmsurround.selective.data.SearchConfig;
import org.osmtools.api.BoundingBox;

public interface OsmDataConverter {

	boolean canHandle(SearchConfig searchConfig);

	DownloadDataResponse convert(BoundingBox boundingBox, SearchConfig searchConfig);

}
