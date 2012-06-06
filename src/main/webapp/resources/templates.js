var templates = {
	building : {
		"building" : {
			label : "Building",
			name : "building",
			type : "select",
			options : [ {
				value : ""
			}, {
				value : "yes"
			} ]
		},

		"addr:street" : {
			labelCode : "tag_addr_street",
			name : "addr:street",
			type : "text"
		},
		"addr:housenumber" : {
			labelCode : "tag_addr_housenumber",
			name : "addr:housenumber",
			type : "text"
		},
		"addr:postcode" : {
			labelCode : "tag_addr_postcode",
			name : "addr:postcode",
			type : "text"
		},
		"addr:city" : {
			labelCode : "tag_addr_city",
			name : "addr:city",
			type : "text"
		},
		"addr:country" : {
			labelCode : "tag_addr_country",
			name : "addr:country",
			type : "text"
		}
	},
	noname : {
		name : {
			label : "Name",
			name : "name",
			type : "text"
		}
	},
	track : {
		tracktype : {
			label : "Tracktype",
			name : "tracktype",
			type : "select",
			options : [ {
				value : ""
			}, {
				value : "grade1"
			}, {
				value : "grade2"
			}, {
				value : "grade3"
			}, {
				value : "grade4"
			}, {
				value : "grade5"
			} ]
		},
		surface : {
			label : "Surface",
			name : "surface",
			type : "select",
			options : [ {
				value : ""
			}, {
				value : "artificial_turf"
			}, {
				value : "asphalt"
			}, {
				value : "cobblestone"
			}, {
				value : "concrete"
			}, {
				value : "compacted "
			}, {
				value : "dirt"
			}, {
				value : "grass"
			}, {
				value : "grass_paver:lanes"
			}, {
				value : "gravel"
			}, {
				value : "ground"
			}, {
				value : "metal"
			}, {
				value : "pebblestone"
			}, {
				value : "paved"
			}, {
				value : "sand"
			}, {
				value : "tartan"
			}, {
				value : "unpaved"
			}, {
				value : "wood"
			} ]
		}
	}
};
