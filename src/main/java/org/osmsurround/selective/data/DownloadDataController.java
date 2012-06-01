package org.osmsurround.selective.data;

import javax.servlet.http.HttpServletRequest;

import org.osmsurround.api.BoundingBox;
import org.osmsurround.geojson.Geometry;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("downloadData")
public class DownloadDataController {

	@Autowired
	private DownloadService downloadService;

	@RequestMapping(method = RequestMethod.GET)
	public @ResponseBody
	Geometry get(BoundingBox boundingBox, SearchConfig searchConfig, HttpServletRequest request) throws Exception {
		searchConfig.setUseOverpass(request.getParameter("useOverpass"));
		searchConfig.setWithoutSurface(request.getParameter("withoutSurface"));
		searchConfig.setAllTracks(request.getParameter("allTracks"));
		searchConfig.setShowBuildings(request.getParameter("showBuildings"));
		return downloadService.downloadData(boundingBox, searchConfig);
	}
}
