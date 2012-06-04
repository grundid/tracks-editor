package org.osmsurround.selective.data;

import java.util.Collection;

import org.osmsurround.selective.template.OsmDataConverter;
import org.osmtools.api.BoundingBox;
import org.osmtools.geojson.FeatureCollection;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DownloadService {

	@Autowired
	private Collection<OsmDataConverter> converters;

	public FeatureCollection downloadData(BoundingBox boundingBox, SearchConfig searchConfig) {
		for (OsmDataConverter osmDataConverter : converters) {
			if (osmDataConverter.canHandle(searchConfig)) {
				return osmDataConverter.convert(boundingBox, searchConfig);
			}
		}
		throw new UnsupportedOperationException("No handler found");
	}
}
