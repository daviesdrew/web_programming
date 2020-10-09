import React from 'react';
import './index.css';
import ManuscriptResults from './ManuscriptResults/';
import { ApocryphaList, ApocryphaDetail } from '../../Templates/Apocrypha';
import { BibliographyList, BibliographyDetail } from '../../Templates/Bibliography';
import * as ENV from '../../config/literals';
import * as UTILS from '../../config/utils.js';

const SearchResults = (props) => {
	const {
		isSearching,
		docs,
		expandedDocPanelOpen,
		expandedDoc,
		sortBy,
		updateExpandedDocPanel,
		prevSearchFields
	} = props;
	//const [currentResultTab, handleResultNav] = React.useState('list');
	return (
		<div className='search-results'>
		{ (UTILS.validateObject(prevSearchFields) && UTILS.validateArray(docs)) &&
				<div className="search-results__top">
					<div className="search-results__top__summary">Showing {docs.length} results which match {prevSearchFields.connective.value === "or" ? 'any' : 'all' } of following terms: </div>
					{ Object.keys(prevSearchFields).map(entry =>
							prevSearchFields[entry].value !== '' && entry !== 'connective' &&
							<div className="searched-term">
								<span className="searched-term__label">{prevSearchFields[entry].label}</span>: 
								<span className="searched-term__value">{prevSearchFields[entry].value}</span>
							</div>)}
				</div>
			}
			
			{ UTILS.validateArray(docs)
				?	<React.Fragment>
					{ (isSearching === ENV.IDEN_MANUSCRIPT) &&

							<ManuscriptResults {...props} />
					}
					{ (isSearching === ENV.IDEN_APOCRYPHA) &&
					( <div className='search-results__body'>
						<ApocryphaList
							sortBy={sortBy}
							docs={docs}
							expandedDoc={expandedDoc}
							updateExpandedDocPanel={updateExpandedDocPanel}
							expandedDocPanelOpen={expandedDocPanelOpen}
						/>
						<ApocryphaDetail
							expandedDoc={expandedDoc}
							updateExpandedDocPanel={updateExpandedDocPanel}
							expandedDocPanelOpen={expandedDocPanelOpen}
							viewMode="panel"
						/>
					</div>)}
					{isSearching === ENV.IDEN_BIBLIO &&
						<div className='search-results__body'>
							<BibliographyList
								sortBy={sortBy}
								docs={docs}
								expandedDoc={expandedDoc}
								updateExpandedDocPanel={updateExpandedDocPanel}
								expandedDocPanelOpen={expandedDocPanelOpen}
							/>
							<BibliographyDetail
							expandedDoc={expandedDoc}
							updateExpandedDocPanel={updateExpandedDocPanel}
							expandedDocPanelOpen={expandedDocPanelOpen}
							viewMode="panel"
							/>
						</div>
					}
					</React.Fragment>
				: <div className='noresults-display'>Sorry, no results found.</div>	
		}
		</div>
	);
}

export default SearchResults;