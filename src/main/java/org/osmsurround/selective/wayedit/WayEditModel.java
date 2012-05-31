package org.osmsurround.selective.wayedit;

import java.util.Map;

public class WayEditModel {

	private Map<Long, WayEdit> ways;
	private String comment;
	private String token;
	private String tokenSecret;

	public Map<Long, WayEdit> getWays() {
		return ways;
	}

	public void setWays(Map<Long, WayEdit> ways) {
		this.ways = ways;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public String getTokenSecret() {
		return tokenSecret;
	}

	public void setTokenSecret(String tokenSecret) {
		this.tokenSecret = tokenSecret;
	}

}
