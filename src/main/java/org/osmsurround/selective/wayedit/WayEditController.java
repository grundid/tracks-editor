package org.osmsurround.selective.wayedit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/wayEdit")
public class WayEditController {

	@Autowired
	private WayEditService wayEditService;

	@RequestMapping(method = RequestMethod.POST)
	public @ResponseBody
	WayEditResult post(@RequestBody WayEditModel wayEditModel) {
		try {
			wayEditService.updateWays(wayEditModel);
			return new WayEditResult("OK");
		}
		catch (Exception e) {
			return new WayEditResult(e.getMessage());
		}
	}
}
