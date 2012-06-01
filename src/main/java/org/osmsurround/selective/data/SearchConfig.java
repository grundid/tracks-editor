package org.osmsurround.selective.data;

public class SearchConfig {

	private String withoutSurface;
	private String useOverpass;
	private String showBuildings;
	private String allTracks;

	public String getShowBuildings() {
		return showBuildings;
	}

	public void setShowBuildings(String showBuildings) {
		this.showBuildings = showBuildings;
	}

	public String getAllTracks() {
		return allTracks;
	}

	public void setAllTracks(String allTracks) {
		this.allTracks = allTracks;
	}

	public String getWithoutSurface() {
		return withoutSurface;
	}

	public void setWithoutSurface(String withoutSurface) {
		this.withoutSurface = withoutSurface;
	}

	public String getUseOverpass() {
		return useOverpass;
	}

	public void setUseOverpass(String useOverpass) {
		this.useOverpass = useOverpass;
	}

	public boolean isUseOverpass() {
		return "true".equals(useOverpass);
	}

	public boolean isShowBuildings() {
		return "true".equals(showBuildings);
	}

	public boolean isAllTracks() {
		return "true".equals(allTracks);
	}

	public boolean isWithoutSurface() {
		return "true".equals(withoutSurface);
	}
}
