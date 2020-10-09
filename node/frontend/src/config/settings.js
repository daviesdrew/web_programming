import React from 'react';

export const bibliography_template = [
	{ 	type: 'header', 
		lines: [ 
			[ { style:null, attr:'title'} ], 
			[ { style: null, attr:"publicationType"}, { style: null, attr: 'year'} ]
		]
	},
	{ 	type: 'main', 
		title: null, 
		style: null, 
		sections: [
			{ type: 'table', style: null, title: null, rows: [ 
					{ style: null, label: 'Title', attr: 'title'}, { style: null, label: 'Publication Type', attr: "publicationType"}, 
					{ style: null, label: 'Year', attr: 'year'}, { style: null, label: 'Year', attr: 'year'}
				]
			},
		]
	}
];
/*
export const manuscript_header_template = {
	manuscript_header: 
		{ 	type: 'header', 
			lines: [ 
				[ { style: null, attr:'censusId'}, { style: null, attr:'city'}, {style: null, attr: 'country'}  ], 
				[ {style: null, attr: 'repository'}, { style: null, attr:"shelfMark"}, { style: null, attr: 'dateRange'}, {style: null, attr: 'status'} ]
			]
		},
	manuscript_detail_rows:
		[
			{ style: null, label: 'Census no.', attr: 'censusId'}, { style: null, label: 'City', attr: "city"}, 
			{ style: null, label: 'Country', attr: 'country'}, { style: null, label: 'Repository', attr: 'repository'},
			{ style: null, label: 'Shelfmark', attr: 'shelfMark'}, { style: null, label: 'Old shelfmarks', attr: 'oldShelfMarks'},
			{ style: null, label: 'Dimensions', attr: 'dimensions'}, { style: null, label: 'No of leaves/pages', attr: 'leavesPages'},
			{ style: null, label: 'Languages', attr: 'languages'}, { style: null, label: 'Status', attr: 'status'},
			{ style: null, label: 'Note on ms', attr: 'notes'}, { style: null, label: 'Correspondence', attr: 'correspondence'},
		 	{ style: null, label: 'Correspondent', attr: 'correspondent'}
			]
		ms_apocrypha_detail: 
		{ type: 'table', style: null, title: 'Manuscript', rows: [ 
			{ style: null, label: 'Census no.', attr: 'censusId'}, { style: null, label: 'City', attr: "city"}, 
			{ style: null, label: 'Country', attr: 'country'}, { style: null, label: 'Repository', attr: 'repository'},
			{ style: null, label: 'Shelfmark', attr: 'shelfMark'}, { style: null, label: 'Old shelfmarks', attr: 'oldShelfMarks'},
			{ style: null, label: 'Dimensions', attr: 'dimensions'}, { style: null, label: 'No of leaves/pages', attr: 'leavesPages'},
			{ style: null, label: 'Languages', attr: 'languages'}, { style: null, label: 'Status', attr: 'status'},
			{ style: null, label: 'Note on ms', attr: 'notes'}, { style: null, label: 'Correspondence', attr: 'correspondence'},
		 	{ style: null, label: 'Correspondent', attr: 'correspondent'}
			]
		}
*/