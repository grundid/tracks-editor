package org.osmsurround.selective.data;

public class WayFeatures {

	private boolean highwayTrack = false;
	private boolean grade = false;
	private boolean surface = false;
	private boolean highway = false;

	private boolean sidewalk = false;

	public boolean isSidewalk() {
		return sidewalk;
	}

	public void setSidewalk() {
		this.sidewalk = true;
	}
	
	public boolean isHighway() {
		return highway;
	}

	public void setHighway() {
		this.highway = true;
	}

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
