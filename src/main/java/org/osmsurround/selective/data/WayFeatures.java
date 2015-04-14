package org.osmsurround.selective.data;

public class WayFeatures {

	private boolean highwayTrack = false;
	private boolean highwayStreet = false;
	private boolean highway = false;
	
	private boolean grade = false;
	private boolean surface = false;
	private boolean sidewalk = false;
	private boolean incline = false;
	private boolean smoothness = false;
	
	/**
	 * Tests, for highway=track
	 * 
	 * @return <code>true</code> if highway=track, <code>false</code> otherwise
	 */
	public boolean isHighwayTrack() {
		return highwayTrack;
	}

	public void setHighwayTrack() {
		this.highwayTrack = true;
	}
	
	/**
	 * Tests, for highway=primary|secondary|tertiary|unclassified|residential|service|living_street
	 * 
	 * @return <code>true</code> if highway=primary|secondary|tertiary|unclassified|residential|service|living_street, <code>false</code> otherwise
	 */
	public boolean isHighwayStreet() {
		return highwayStreet;
	}

	public void setHighwayStreet() {
		this.highwayStreet = true;
	}
	
	/**
	 * Tests, for highway
	 * 
	 * @return <code>true</code> way has key highway, <code>false</code> otherwise
	 */
	public boolean isHighway() {
		return highway;
	}

	public void setHighway() {
		this.highway = true;
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

	public boolean hasSmoothness() {
		return smoothness;
	}

	public void setSmoothness() {
		this.smoothness = true;
	}

	public boolean hasIncline() {
		return incline;
	}

	public void setIncline() {
		this.incline = true;
	}

	public boolean hasSidewalk() {
		return sidewalk;
	}

	public void setSidewalk() {
		this.sidewalk = true;
	}
	

}
