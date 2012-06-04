package org.osmsurround.selective.data;

import org.osmtools.api.BoundingBox;
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
	DownloadDataResponse get(BoundingBox boundingBox, SearchConfig searchConfig) throws Exception {
		return downloadService.downloadData(boundingBox, searchConfig);
	}
}
