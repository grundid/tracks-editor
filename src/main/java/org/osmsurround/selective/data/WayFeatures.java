package org.osmsurround.selective.data;

public class WayFeatures {

	private boolean highwayTrack = false;
	private boolean grade = false;
	private boolean surface = false;

	public boolean isHighwayTrack() {
		return highwayTrack;
	}

	public void setHighwayTrack() {
		this.highwayTrack = true;
	}

	public boolean isGrade() {
		return grade;
	}

	public void setGrade() {
		this.grade = true;
	}

	public boolean isSurface() {
		return surface;
	}

	public void setSurface() {
		this.surface = true;
	}

}
