package org.osmsurround.selective.template;

import org.junit.Assert;
import org.junit.Test;
import org.osm.schema.ObjectFactory;
import org.osm.schema.Osm;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.Unmarshaller;
import java.io.InputStream;

public class NoAddressBuildingDataConverterTest {

	private NoAddressBuildingDataConverter dataConverter = new NoAddressBuildingDataConverter();

	@Test
	public void itShouldFindTheAddressNode() throws Exception {
		InputStream inputStream = NoAddressBuildingDataConverter.class.getResourceAsStream("/building-with-address-node.xml");
		Unmarshaller unmarshaller = JAXBContext.newInstance(ObjectFactory.class).createUnmarshaller();
		Osm osm = (Osm)unmarshaller.unmarshal(inputStream);
		Assert.assertNotNull(inputStream);
		Assert.assertNotNull(osm);

		ConverterContext converterContext = new ConverterContext(osm,"building",null);
		Assert.assertFalse(dataConverter.useObject(osm.getWay().get(0), converterContext));
	}
}