package org.osmsurround.selective.data;

public class WayFeatures {

	private boolean highwayTrack = false;
	private boolean grade = false;
	private boolean surface = false;
	private boolean street = false;

	private boolean sidewalk = false;

	public boolean isSidewalk() {
		return sidewalk;
	}

	public void setSidewalk() {
		this.sidewalk = true;
	}
	
	/**
	 * Tests, for highway=primary|secondary|tertiary|unclassified|residential|service|living_street
	 * 
	 * @return
	 */
	public boolean isStreet() {
		return street;
	}

	public void setStreet() {
		this.street = true;
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
