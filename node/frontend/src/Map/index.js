import React, { Component } from 'react';
import './index.css';
import L from 'leaflet';
import opencage from 'opencage-api-client';
import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/leaflet.js';

// This portion is needed to properly render the marker icons for Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
	iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
	iconUrl: require('leaflet/dist/images/marker-icon.png'),
	shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

function onEachFeature(feature, layer) {
	// Attaches a popup to each feature of the map
	if (feature.properties && feature.properties.popupContent) {
		layer.bindPopup(feature.properties.popupContent);
		console.log('trigger');
	}
}

// eventually can probably move this 'map' var into the component as a property
let map;
class Map extends Component {
	constructor(props) {
		console.log("Map constructor called");
		super(props);
		this.getMarkers = this.getMarkers.bind(this);
	}

	// function get markers from geocage
	// takes in a documents array and the Leaflet map
	getMarkers(docs, map) {
		console.log('performing new geocode request');
		// NEED TO REMOVE PREVIOUS SEARCH MARKERS
		docs.forEach((doc) => { 
			opencage.geocode({
				key: '860cc17dacfc4b13b4d30962190e8d43',
				q: doc.mapEvent.city + ' ' + doc.mapEvent.country
			}).then(response => {
				var geojsonFeature = {
					'type': 'Feature',
					'properties': {
						'name': doc.repository,
						'amenity': doc.material,
						'popupContent': "<div>Repository: " + doc.repository + "</div><div>Shelf Mark: " + doc.shelfMark + "</div><div>" + doc.mapEvent.city + ", " + doc.mapEvent.country + "</div>"
					},
					"geometry": {
						"type": "Point",
						"coordinates": [response.results[0].geometry.lng, response.results[0].geometry.lat]
					}
				};
				L.geoJson(geojsonFeature, {
					onEachFeature: onEachFeature
				}).addTo(map).on('click', (e)=> { this.props.updateExpandedDocPanel(doc) });
			});
		});
	}

	// Build the initial map
	componentDidMount() {
		//console.log('component did mount');
		var maxBounds_corner1 = L.latLng(-90, -180);
		var maxBounds_corner2 = L.latLng(90, 180);
		var maxBounds = L.latLngBounds(maxBounds_corner1, maxBounds_corner2);
		// create map
		map = L.map('mapid', {
			maxBounds: maxBounds
		}).setView([51.505, -0.09], 3);
		let tileLayer = 'https://api.mapbox.com/styles/v1/acs-4901-team-4-201920/ck6fe3grr0pis1iqv13uwvn78/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiYWNzLTQ5MDEtdGVhbS00LTIwMTkyMCIsImEiOiJjazZmZHE4MDQwN3l5M2VtdHVzc3B6MXlwIn0.EaHlEUyJcTlKOBGFazB6Wg';
		L.tileLayer(tileLayer, {
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
			minZoom: 4,
			maxZoom: 13,
		}).addTo(map);
		this.getMarkers(this.props.docs, map);
	}
	
	shouldComponentUpdate(nextProps, nextState) {
		// if still on map view AND no changes in documents
		// only adjust the size of the Leaflet Div (make sure it fits available space)
		// NOTE: setTimeout is way of dealing with common React Leaflet Rendering issue 
		// hopefully can find more elegant solution later
		if (this.props.currentResultTab === nextProps.currentResultTab && nextProps.docs === this.props.docs) {
			//console.log('shouldcomponentupdate - false');
			setTimeout(()=>map.invalidateSize(true), 250);
			return false;
		// if new documents are incoming - removed old markers and add new markers
		} else if (this.props.docs != nextProps.docs && nextProps.docs.length > 0) {
			// need to find way to remove previous markers
			setTimeout(()=>map.invalidateSize(true), 250);
			this.getMarkers(nextProps.docs, map);
			return true;
		} else {
			// full rebuild ?
			console.log('shouldcomponentupdate - true');
			setTimeout(()=>map.invalidateSize(true), 250);
			return true;
		}
	}

	// basically when its handed a prop that says currentResultTab = map, it shows itself
	// otherwise it doesn't display anything
	// if possible should relocate these link and script tags elsewhere?
	render() {
		return (
			<div className='mapdiv' id='mapid' style={{display: (this.props.currentResultTab === 'map' ? 'block' : 'none' )}}>
				<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/opencagedata/leaflet-opencage-search@1.3.0/dist/css/L.Control.OpenCageData.Search.min.css"></link>
				<script src="https://cdn.jsdelivr.net/gh/opencagedata/leaflet-opencage-search@1.3.0/dist/js/L.Control.OpenCageSearch.min.js"></script>
			</div>
		);
	}
}

export default Map;
