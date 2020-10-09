import React, { Component } from 'react';
import { ManuscriptList, ManuscriptDetail } from '../Templates/Manuscript/';
import { ApocryphaList, ApocryphaDetail } from '../Templates/Apocrypha';
import { BibliographyList, BibliographyDetail } from '../Templates/Bibliography';
import * as ENV from '../config/literals';
import './index.css';
//import '../App/common.css';
export const DocsContext = React.createContext({ docs: [], isBrowsing: '', expandedDoc: {}});
export const FunctionContext = React.createContext({ changeCategory: null, updateExpandedDocPanel: null, sortBy: null});

class BrowseView extends Component { 
	constructor(props) {
		super(props);
		this.state = {
			isBrowsing: props.isBrowsing,
			docs: [],
			expandedDocPanelOpen: false,
			expandedDoc: null,
			sortKey: null
		};
		this.changeBrowseCategory = this.changeBrowseCategory.bind(this);
		this.updateExpandedDocPanel = this.updateExpandedDocPanel.bind(this);
		this.sortBy = this.sortBy.bind(this);
	}

	changeBrowseCategory(name, path) {
		fetch(ENV.DB_API + path)
			.then(res => res.json())
			.then(res => {
				this.setState({
					docs: res,
					isBrowsing: name,
					expandedDoc: null
				})
			}).catch(err => err);
	}

	updateExpandedDocPanel(doc, get = true, overlay = false) {
		// if expandedDoc has already been loaded once
		if (!get && doc !== this.state.expandedDoc) {
			this.setState({
				expandedDoc: doc,
				expandedDocPanelOpen: true
			})
		} else if (this.state.expandedDoc === null || doc._id !== this.state.expandedDoc._id) {
			let toSend = {
				type: this.state.isBrowsing,
				id: doc._id
			}
			console.log(toSend);
			this.asyncSearch(ENV.DB_API_SINGLE, toSend).then((data) => {
				if (this.state.isBrowsing === ENV.IDEN_APOCRYPHA) {
					let find_ms = {
						searchCategory: ENV.IDEN_MANUSCRIPT,
						fields: [{name: 'apoc_id', value: data._id}]
					};
					this.asyncSearch(ENV.DB_API_SEARCH, find_ms).then((ms_list) => {
						let temp = data;
						temp.containedInManuscripts = ms_list;
						this.setState({
							expandedDoc: temp,
							expandedDocPanelOpen: true
						})
				})
				} else {
					this.setState({
						expandedDoc: data, 
						expandedDocPanelOpen: true
					})
				}
			})	
		} else if (this.state.expandedDocPanelOpen === false) {
			// there is a document already loaded - need to display it
			this.setState({
				expandedDocPanelOpen: true
			});
		} else {
			// there is a document loaded and displayed - need to collapse
			this.setState({
				expandedDocPanelOpen: false
			});
		}
	}

	async asyncSearch(url = '', data = {}) {
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});
		return await response.json();
	}

	// sort the document list
	sortBy(sortKey) {
		// 
		// reverse sorting if this sort key already applied
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

	componentDidMount() {
		this.changeBrowseCategory(this.props.isBrowsing, 'all' + this.props.isBrowsing);
	}

	componentDidUpdate(prevProps) {
		if (this.props.isBrowsing !== prevProps.isBrowsing) {
			this.changeBrowseCategory(this.props.isBrowsing, 'all' + this.props.isBrowsing);
		}
	}
	
	render() {
		return (
			// WIP
			<DocsContext.Provider value={
				{	docs: this.state.docs, 
					isBrowsing: this.state.isBrowsing,
					expandedDoc: this.state.expandedDoc
				}
				}>
			<div className='browse-container'>
				{this.state.isBrowsing === ENV.IDEN_MANUSCRIPT && 
					[
						<ManuscriptList
							sortBy={this.sortBy}
							docs={this.state.docs}
							expandedDoc={this.state.expandedDoc}
							updateExpandedDocPanel={this.updateExpandedDocPanel}
							expandedDocPanelOpen={this.state.expandedDocPanelOpen}
							prevSearch={{}}				
						/>,
						<ManuscriptDetail
							expandedDocPanelOpen={this.state.expandedDocPanelOpen}
							ms={this.state.expandedDoc}
							updateExpandedDocPanel={this.updateExpandedDocPanel}
							viewMode="panel"
							prevSearch={{}}
						/>
					]
				}
				{this.state.isBrowsing === ENV.IDEN_APOCRYPHA &&
					[
						<ApocryphaList
							sortKey={this.state.sortKey}
							sortBy={this.sortBy}
							docs={this.state.docs}
							expandedDoc={this.state.expandedDoc}
							updateExpandedDocPanel={this.updateExpandedDocPanel}
							expandedDocPanelOpen={this.state.expandedDocPanelOpen}
							prevSearch={{}}

						/>,
						<ApocryphaDetail
							expandedDocPanelOpen={this.state.expandedDocPanelOpen}
							expandedDoc={this.state.expandedDoc}
							updateExpandedDocPanel={this.updateExpandedDocPanel}
							viewMode="panel"
							prevSearch={{}}
						/>
					]
				}
				{this.state.isBrowsing === ENV.IDEN_BIBLIO &&
					[
						<BibliographyList
							sortBy={this.sortBy}
							docs={this.state.docs}
							expandedDoc={this.state.expandedDoc}
							updateExpandedDocPanel={this.updateExpandedDocPanel}
							expandedDocPanelOpen={this.state.expandedDocPanelOpen}
							prevSearch={{}}
						/>,
						<BibliographyDetail
							expandedDocPanelOpen={this.state.expandedDocPanelOpen}
							expandedDoc={this.state.expandedDoc}
							updateExpandedDocPanel={this.updateExpandedDocPanel}
							viewMode="panel"
							prevSearch={{}}
						/>
					]
				}
			</div>
			</DocsContext.Provider>
		);
	}
}

export default BrowseView;
