package org.osmsurround.selective.wayedit;

import static org.junit.Assert.*;

import org.junit.Before;
import org.junit.Test;
import org.osm.schema.ObjectFactory;
import org.osm.schema.OsmTag;
import org.osm.schema.OsmWay;

public class WayEditTest {

	private OsmWay osmWay;
	private ObjectFactory of = new ObjectFactory();

	@Before
	public void setup() {
		osmWay = of.createOsmWay();
		osmWay.getTag().add(createTag("highway", "track"));
		osmWay.getTag().add(createTag("tracktype", "grade2"));
	}

	private OsmTag createTag(String key, String value) {
		OsmTag osmTag = of.createOsmTag();
		osmTag.setK(key);
		osmTag.setV(value);
		return osmTag;
	}

	@Test
	public void testUpdateOsmWay() throws Exception {
		WayEdit wayEdit = new WayEdit();
		wayEdit.setTracktype("grade1");
		wayEdit.setSurface("gravel");

		wayEdit.updateOsmWay(osmWay);

		assertEquals("tracktype", osmWay.getTag().get(1).getK());
		assertEquals("grade1", osmWay.getTag().get(1).getV());
		assertEquals("surface", osmWay.getTag().get(2).getK());
		assertEquals("gravel", osmWay.getTag().get(2).getV());

	}

	@Test
	public void testUpdateOsmWayDelete() throws Exception {
		WayEdit wayEdit = new WayEdit();
		wayEdit.setTracktype("");
		wayEdit.setSurface("");

		wayEdit.updateOsmWay(osmWay);
		assertEquals(1, osmWay.getTag().size());
	}
}
