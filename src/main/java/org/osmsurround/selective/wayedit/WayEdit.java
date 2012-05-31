package org.osmsurround.selective.wayedit;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;

import org.osm.schema.OsmTag;
import org.osm.schema.OsmWay;
import org.springframework.util.StringUtils;

public class WayEdit {

	private long wayId;

	private String tracktype;
	private String surface;

	public long getWayId() {
		return wayId;
	}

	public void setWayId(long wayId) {
		this.wayId = wayId;
	}

	public String getTracktype() {
		return tracktype;
	}

	public void setTracktype(String tracktype) {
		this.tracktype = tracktype;
	}

	public String getSurface() {
		return surface;
	}

	public void setSurface(String surface) {
		this.surface = surface;
	}

	public void updateOsmWay(OsmWay osmWay) {
		Map<String, String> values = new HashMap<String, String>();
		values.put("tracktype", tracktype);
		values.put("surface", surface);

		for (Iterator<OsmTag> it = osmWay.getTag().iterator(); it.hasNext();) {
			OsmTag tag = it.next();
			String value = values.get(tag.getK());
			if (value != null) {
				if (StringUtils.hasText(value)) {
					tag.setV(value);
				}
				else
					it.remove();

				values.remove(tag.getK());
			}
		}
		for (Entry<String, String> entry : values.entrySet()) {
			if (StringUtils.hasText(entry.getValue())) {
				OsmTag osmTag = new OsmTag();
				osmTag.setK(entry.getKey());
				osmTag.setV(entry.getValue());
				osmWay.getTag().add(osmTag);
			}
		}
	}
}
