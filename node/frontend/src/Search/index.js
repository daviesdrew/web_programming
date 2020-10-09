import React, { Component } from 'react';
import SearchResults from './Results/';
import { SearchForm } from './Forms/';
import * as ENV from '../config/literals';
import './index.css';
import '../App/common.css';
import { searchDefaults } from '../config/data';
import * as UTIL from '../config/utils';

class SearchView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isSearching: null,
			newSearchObject: {},
			docs: [],
			searchPanelOpen: true,
			expandedDocPanelOpen: false,
			ResultOverlayOpen: false,
			expandedDoc: null,
			sortKey: null,
			searchFields: {},
			prevSearchFields: {}
		};
		this.changeSearchCategory = this.changeSearchCategory.bind(this);
		this.initiateSearch = this.initiateSearch.bind(this);
		this.asyncSearch = this.asyncSearch.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.toggleSearchPanel = this.toggleSearchPanel.bind(this);
		this.updateExpandedDocPanel = this.updateExpandedDocPanel.bind(this);
		this.sortBy = this.sortBy.bind(this);
		// handle changes to active search fields
		this.updateSearchFields = this.updateSearchFields.bind(this);
		//
		//this.handleInputChangeNew = this.handleInputChangeNew.bind(this);
		this.handleFieldConnectiveChange = this.handleFieldConnectiveChange.bind(this);
	}

	componentDidMount() {
		// on mount, make sure initial searching fields are correct
		this.setState({
			isSearching: this.props.isSearching,
			searchFields: searchDefaults[this.props.isSearching]
		})
	}

	componentDidUpdate(prevProps) {
		if (this.props.isSearching !== prevProps.isSearching) {
			this.changeSearchCategory(this.props.isSearching);
		}
	}

	updateSearchFields(action, oldField = false, newField = false) {
		if (action === 'remove' && oldField) {
			let temp = this.state.searchFields; // make clone of existing search fields
			delete temp[oldField.name]; // delete this entry from clone
			this.setState({
				searchFields: temp // use clone to set state 
			});
		} else if (action === 'add' && newField) {
			let temp = this.state.searchFields; // clone existing state searchfields
			if (!temp[newField.name]) { // if not already in fields
				temp[newField.name] = newField;
				this.setState({
					searchFields: temp
				})
			} 
		} 
	}

	// can possibly remove the get = true if MS content is removed
	updateExpandedDocPanel(doc, get = true) {
		//console.log(doc);
		if (!get && doc !== this.state.expandedDoc) {
			this.setState({
				expandedDoc: doc,
				expandedDocPanelOpen: true
			})
		} else if (this.state.expandedDoc === null || doc._id !== this.state.expandedDoc._id) {
			// need to get a doc
			let toSend = {
				type: this.state.isSearching,
				id: doc._id
			}
			this.asyncSearch(ENV.DB_API_SINGLE, toSend).then(
				(data) => {
					console.log(data);
					this.setState({
						expandedDoc: data,
						expandedDocPanelOpen: true,
						searchPanelOpen: false // pending view pref
					})
				}
			);
		} else if (this.state.expandedDocPanelOpen === false) {
			// same doc - need to expand detail panel
			this.setState({
				expandedDocPanelOpen: true,
				searchPanelOpen: false, // pending view pref
			});
		} else {
			this.setState({
				expandedDocPanelOpen: false,
				searchPanelOpen: true // pending view pref
			});
		}
	}

	toggleSearchPanel() {
		this.setState({
			expandedDocPanelOpen: false,
			searchPanelOpen: !this.state.SearchPanelOpen
		});
	}

	changeSearchCategory(category) {
		this.setState({
			searchPanelOpen: true,
			expandedDoc: null,
			docs: [],
			expandedDocPanelOpen: false,
			isSearching: category,
			searchFields: searchDefaults[category],
			prevSearchFields: null
		});
	}
	
	//handleInputChange(event) {} 

	handleInputChange(name, value) {
		let temp = this.state.searchFields;
		temp[name].value = value;
		this.setState(()=>({ searchFields: temp }));
	}

	handleFieldConnectiveChange(name, connective) {
		let temp = this.state.searchFields;
		temp[name].fieldconnective = connective;
		this.setState(()=>({searchFields: temp}));
	}

	initiateSearch() {
		const f = this.state.searchFields;
		let toSend = { searchCategory: this.state.isSearching, fields: [], connective: f.connective.value }
		Object.keys(f).map(entry =>
			entry !== 'connective' && // don't send connective in search fields
				toSend.fields.push(
					{ 	name: f[entry].name, 
						value: f[entry].value, 
						fieldconnective: f[entry].fieldconnective || 'in', 
						exact: f[entry].exact || 'yes' 
					}
				)
			);
		console.log(toSend);
		this.asyncSearch(ENV.DB_API_SEARCH, toSend).then((data) => this.setState(
			{ docs: data, prevSearchFields: JSON.parse(JSON.stringify(f)) }) // need a deep copy of object here
		);
	}

	async asyncSearch(url = '', data = {}) {
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});
		return await response.json(); // parses JSON res into native JS object
	}

	sortBy(sortKey) {
		if (UTIL.validateArray(this.state.docs)) {
			if (sortKey === this.state.sortKey) {
				this.setState({
					docs: this.state.docs.reverse()
				});
			} else {
				this.setState({
					sortKey: sortKey,
					docs: this.state.docs.sort((a, b) => (a[sortKey] > b[sortKey]) ? 1 : (b[sortKey] > a[sortKey] ? -1 : 0))
				});
			}
		}
	}

	render() {
		return (
			<div className='search-container'>
				<div className='search-container__body'>
					<SearchForm
						initiateSearch={this.initiateSearch}
						handleInputChange={this.handleInputChange}
						toggleSearchPanel={this.toggleSearchPanel}
						isSearching={this.state.isSearching}
						searchPanelOpen={this.state.searchPanelOpen}
						searchFields={this.state.searchFields}
						updateSearchFields={this.updateSearchFields}
						handleFieldConnectiveChange={this.handleFieldConnectiveChange}
					/>
					<SearchResults
						docs={this.state.docs}
						updateExpandedDocPanel={this.updateExpandedDocPanel}
						expandedDocPanelOpen={this.state.expandedDocPanelOpen}
						expandedDoc={this.state.expandedDoc}
						sortBy={this.sortBy}
						isSearching={this.state.isSearching}
						prevSearchFields={this.state.prevSearchFields}
					/>
				</div>
			</div>
		);
	}
}

export default SearchView;
