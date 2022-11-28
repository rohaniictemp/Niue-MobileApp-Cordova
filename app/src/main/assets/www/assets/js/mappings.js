var mappingdata = {
	
	"Departments":[
		 {
		  "Departmentname": "EIMS",
		  "Departmentcode": "EIM"
		 },
		 {
		  "Departmentname": "Education",
		  "Departmentcode": "EDU"
		 },
		 {
		  "Departmentname": "Environment",
		  "Departmentcode": "ENV"
		 },
		 {
		  "Departmentname": "Government",
		  "Departmentcode": "GOV"
		 },
		 {
		  "Departmentname": "Health",
		  "Departmentcode": "HEL"
		 },
		 {
		  "Departmentname": "Met Office",
		  "Departmentcode": "MET"
		 },
		 {
		  "Departmentname": "Infrastructure",
		  "Departmentcode": "INF"
		 },
		 {
		  "Departmentname": "Community Affairs",
		  "Departmentcode": "COM"
		 }
	],
	"Themes":[
		 {
		  "Themename": "GeologyandSoils",
		  "Themecode": "GESO"
		 },
		 {
		  "Themename": "Geographical Names",
		  "Themecode": "GEGH"
		 },
		 {
		  "Themename": "Addresses",
		  "Themecode": "ADDR"
		 },
		 {
		  "Themename": "Functional Areas",
		  "Themecode": "FUNA"
		 },
		 {
		  "Themename": "Buildings and Settlements",
		  "Themecode": "BUSE"
		 },
		 {
		  "Themename": "Land Parcels",
		  "Themecode": "LAPA"
		 },
		 {
		  "Themename": "Transport Networks",
		  "Themecode": "TRNE"
		 },
		 {
		  "Themename": "Elevation and depth",
		  "Themecode": "ELDE"
		 },
		 {
		  "Themename": "Population distribution",
		  "Themecode": "PODI"
		 },
		 {
		  "Themename": "Land Cover and Use",
		  "Themecode": "LACO"
		 },
		 {
		  "Themename": "Physical Infrastructure",
		  "Themecode": "PHSD"
		 },
		 {
		  "Themename": "Water",
		  "Themecode": "WATE"
		 },
		 {
		  "Themename": "Imagery",
		  "Themecode": "IMAG"
		 },
		 {
		  "Themename": "Others",
		  "Themecode": "OTHE"
		 }
	],
	"Mappings":[
		 {
		  "Code": "EIM",
		  "Relation": "GESO,GEGH,FUNA,LAPA,TRNE"
		 },
		 {
		  "Code": "EDU",
		  "Relation": "GESO,BUSE,LACO"
		 },
		 {
		  "Code": "ENV",
		  "Relation": "GESO,PHSD,ELDE,WATE"
		 },
		 {
		  "Code": "GOV",
		  "Relation": "TRNE,IMAG,PODI"
		 },
		 {
		  "Code": "HEL",
		  "Relation": "GEGH,LAPA,TRNE,GESO,FUNA,ELDE"
		 },
		 {
		  "Code": "MET",
		  "Relation": "GEGH,GESO,FUNA,LAPA"
		 },
		 {
		  "Code": "INF",
		  "Relation": "LACO,ADDR,PHSD,GEGH"
		 },
		 {
		  "Code": "COM",
		  "Relation": "FUNA,GESO"
		 }
	]
}
//});