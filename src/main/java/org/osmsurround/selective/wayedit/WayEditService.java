package org.osmsurround.selective.wayedit;

import java.util.List;

import org.osm.schema.OsmWay;
import org.osmtools.api.ChangesetOperations;
import org.osmtools.api.OsmOperations;
import org.osmtools.oauth.OauthTokens;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class WayEditService {

	private Logger log = LoggerFactory.getLogger(getClass());

	@Autowired
	private OsmOperations osmOperations;

	public void updateWays(WayEditModel wayEditModel) {

		List<OsmWay> wayList = osmOperations.getForManyWays(wayEditModel.getWays().keySet());

		for (OsmWay osmWay : wayList) {
			WayEdit wayEdit = wayEditModel.getWays().get(osmWay.getId().longValue());
			wayEdit.updateOsmWay(osmWay);
		}

		ChangesetOperations changeset = osmOperations.openChangeset(wayEditModel.getComment(), new OauthTokens(
				wayEditModel.getToken(), wayEditModel.getTokenSecret()));
		try {
			for (OsmWay osmWay : wayList) {
				changeset.putWay(osmWay);
			}
		}
		catch (Exception e) {
			log.warn(e.getMessage(), e);
		}
		finally {
			changeset.closeChangeset();
		}
	}
}
