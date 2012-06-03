package org.osmsurround.selective.wayedit;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;

import org.osm.schema.OsmTag;
import org.osm.schema.OsmWay;
import org.springframework.util.StringUtils;

public class WayEdit {

	private long objectId;

	private Map<String, String> tags = new HashMap<String, String>();

	public long getObjectId() {
		return objectId;
	}

	public void setObjectId(long objectId) {
		this.objectId = objectId;
	}

	public Map<String, String> getTags() {
		return tags;
	}

	public void setTags(Map<String, String> tags) {
		this.tags = tags;
	}

	public void updateOsmWay(OsmWay osmWay) {

		for (Iterator<OsmTag> it = osmWay.getTag().iterator(); it.hasNext();) {
			OsmTag tag = it.next();
			String value = tags.get(tag.getK());
			if (value != null) {
				if (StringUtils.hasText(value)) {
					tag.setV(value);
				}
				else
					it.remove();

				tags.remove(tag.getK());
			}
		}
		for (Entry<String, String> entry : tags.entrySet()) {
			if (StringUtils.hasText(entry.getValue())) {
				OsmTag osmTag = new OsmTag();
				osmTag.setK(entry.getKey());
				osmTag.setV(entry.getValue());
				osmWay.getTag().add(osmTag);
			}
		}
	}
}
