import React from 'react';

export const listSortOptions = {
	'apocrypha': [{ name: 'latinTitle', label: 'Latin Title' }, { name: 'eClavis', label: 'eClavis'}],
	'manuscript': [{ name: 'country', label: 'Country' }, {name: 'city', label: 'City'}, {name: 'repository', label: 'Repository'}],
	'bibliography': [{ name: 'title', label: 'Title'}, { name: 'year', label: 'Year'}]
}

const connective = 
	{
		type: 'radio', name: 'connective', label: 'Return results that...', placeholder: 'lc', value: 'or', 
		options: [ 	{opt_name: 'connective', opt_label: 'match all fields', opt_value: 'and'},
						{opt_name: 'connective', opt_label: 'match any fields', opt_value: 'or'}
					]
	};

export const newFieldOptions = {
	 manuscript: [
		{type: 'text', name: 'ms_censusid', label: 'Census Id', placeholder: 'lc', value: [], fieldconnective: 'in', exact: 'no'},
		{type: 'text', name: 'ms_city', label: 'City', placeholder: 'city name', value: [], fieldconnective: 'in', exact: 'no'},
		{type: 'text', name: 'ms_country', label: 'Country', placeholder: 'country name', value: [], fieldconnective: 'in', exact: 'no'},
		{type: 'text', name: 'ms_repository', label: 'Repository', placeholder: 'repository', value: [], fieldconnective: 'in', exact: 'no'},
		{type: 'text', name: 'apoc_title', label: 'Apocrypha Title', placeholder: 'Evangelium Nicodemus', value: [], fieldconnective: 'in', exact: 'no'},
		{type: 'text', name: 'apoc_mstitle', label: 'Contents MSTitle', placeholder: 'e.g. domini...', value: [], fieldconnective: 'in', exact: 'no'},
		{type: 'text', name: 'apoc_incipit', label: 'Incipit contents', placeholder: 'e.g. Passio...', value: [], fieldconnective: 'in', exact: 'no'},
		{type: 'text', name: 'apoc_explicit', label: 'Explicit contents', placeholder: 'e.g. jacobus...', value: [], fieldconnective: 'in',exact: 'no'},
		{type: 'text', name: 'apoc_partcontentstype', label: 'Content types', placeholder: 'e.g. Text, Prologue, ...', value: [],fieldconnective: 'in', exact: 'no'},
		{type: 'select', name: 'ms_languages', label: 'Manuscript Languages', placeholder: 'Select Language', value: 'latin', options: [ {opt_name: 'latin', opt_label: 'Latin'},{opt_name: 'english', opt_label: 'English'}], fieldconnective: 'ignore', exact: 'yes'},
		{type: 'select', name: 'apoc_language', label: 'Apocryphon language', placeholder: 'Select Language', value: 'latin', options: [ {opt_name: 'latin', opt_label: 'Latin'},{opt_name: 'english', opt_label: 'English'}], fieldconnective: 'ignore', exact: 'yes'},
		{type: 'text', name: 'apoc_origin', label: 'Apocryphon origin', placeholder: '', value: [], fieldconnective: 'in', exact: 'no'},
		{type: 'text', name: 'apoc_provenance', label: 'Apocryphon provenance', placeholder: '', value: [], fieldconnective: 'in', exact: 'no'},
		{type: 'text', name: 'apoc_scribe', label: 'Apocryphon scribe', placeholder: '', value: [], fieldconnective: 'in', exact: 'no'}
		
	],
	apocrypha: [
		{type: 'text', name: 'apoc_latinTitle', label: 'Latin Title', placeholder: 'Evangelium', value: [], fieldconnective: 'in', exact: 'no'},
		{type: 'text', name: 'apoc_eclavis', label: 'eClavis', placeholder: '56', value: [], fieldconnective: 'in', exact: 'no'}
		
	],
	bibliography: [
		{type: 'text', name: 'title', label: 'Bibliography Title', placeholder: 'Fundamentals of Database Systems', value: [], fieldconnective: 'in'},
		{type: 'select', name: 'language', label: 'Language', placeholder: 'Select Language', value: '', options: [ {opt_name: 'english', opt_label: 'English'}, {opt_name: 'german', opt_label: 'German'}], fieldconnective: 'ignore', exact: 'yes'}
		
	]
}

export const searchDefaults = {
	manuscript: {
		'ms_city': {type: 'text', name: 'ms_city', label: 'City', placeholder: 'city name', value: [], fieldconnective: 'in', exact: 'no'},
		'ms_country': {type: 'text', name: 'ms_country', label: 'Country', placeholder: 'country name', value: [], fieldconnective: 'in', exact: 'no'},
		'apoc_incipit': {type: 'text', name: 'apoc_incipit', label: 'Incipit contents', placeholder: 'e.g. Passio...', value: [], fieldconnective: 'in', exact: 'no'},
		'apoc_explicit': {type: 'text', name: 'apoc_explicit', label: 'Explicit contents', placeholder: 'e.g. jacobus...', value: [], fieldconnective: 'in',exact: 'no'},
		'connective': connective
	},
	apocrypha: {
		'apoc_latinTitle': { type: 'text', name: 'apoc_latinTitle', label: 'Latin Title', placeholder: 'Evangelium', value: [], fieldconnective: 'in', exact: 'no'},
		'connective': connective
	},
	bibliography: {
		'title': { type: 'text', name: 'title', label: 'Bibliography Title', placeholder: 'Fundamentals of Database Systems', value: [], fieldconnective: 'in', exact: 'no' },
		'connective': connective
	}
};

export const searchMapping = {
	manuscript: {
		censusId: 'ms_censusid', city: 'ms_city', country: 'ms_country', repository: 'ms_repository', shelfMark: 'ms_shelfmark', 
		oldShelfMarks: 'ms_oldshelfmarks', dimensions: 'ms_dimensions', leavesPages: 'ms_leavespages', dateRange: 'ms_daterange',
		languages: 'ms_languages', status: 'ms_status', notes: 'ms_notes', sourceBiblio: 'ms_sourcebiblio', correspondence: 'ms_correspondence',
		correspondent: 'ms_correspondent'
	},
	ms_apocrypha: {
		incipit: 'apoc_incipit', explicit: 'apocrypha_explicit',
		language: 'apoc_language', msTitle: 'apocrpha_mstitle',
		extent: 'apoc_extent', ffpp: 'apocrypha_ffpp',
		version: 'apoc_version', colophon: 'apocrypha_colophon',
		pfExplicit: 'apoca_pfexplicit', pfIncipit: 'apocrypha_pfincipit'
	},
	bibliography: {
		title: 'bib_title', year: 'bib_year', author: 'bib_author', publicationType: 'bib_publicationtype'
	}
}