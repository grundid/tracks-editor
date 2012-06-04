package org.osmsurround.selective.data;

public class SearchConfig {

	private Boolean overpass;
	private String template;

	public Boolean getOverpass() {
		return overpass;
	}

	public void setOverpass(Boolean overpass) {
		this.overpass = overpass;
	}

	public boolean isUseOverpass() {
		return Boolean.TRUE.equals(overpass);
	}

	public String getTemplate() {
		return template;
	}

	public void setTemplate(String template) {
		this.template = template;
	}

}
