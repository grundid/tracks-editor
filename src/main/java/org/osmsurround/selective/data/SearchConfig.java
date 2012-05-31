package org.osmsurround.selective.data;


public class SearchConfig {

	private String withoutSurface;
	private String useOverpass;

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

	public boolean isWithoutSurface() {
		return "true".equals(withoutSurface);
	}
}
