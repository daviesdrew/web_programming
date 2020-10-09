import React from 'react';
import './index.css';
import { ContentList, ContentDetail } from '../../../Content/';
import Map from '../../../Map/';

const ContentResults = (props) => {
	const {
		sortBy,
		docs,
		expandedDoc,
		expandedDocPanelOpen,
		updateExpandedDocPanel
	} = props;
	const [currentResultTab, handleResultNav] = React.useState('list');
	return (
		<React.Fragment>
			<div className='search-container__results-panel__top-nav'>
				<div
					className={'search-container__results-panel__top-nav__tab' + (currentResultTab === 'list' ? '--active' : '')}
					onClick={() =>  handleResultNav('list')}>
					List
					</div>
				<div
					className={'search-container__results-panel__top-nav__tab' + (currentResultTab === 'map' ? '--active' : '')}
					onClick={() => handleResultNav('map')}>
					Map
					</div>
				<div
					className={'search-container__results-panel__top-nav__tab' + (currentResultTab === 'analytics' ? '--active' : '')}
					onClick={() => handleResultNav('analytics')}>
					Insights
					</div>
			</div>
			<div className='search-container__results-panel__body'>
				{
					currentResultTab === 'list' &&
					<div className='search-container__results-panel__body__list'>
						<ContentList
							listStyle='list-panel--search'
							sortBy={sortBy}
							docs={docs}
							expandedDoc={expandedDoc}
							updateExpandedDocPanel={updateExpandedDocPanel}
							expandedDocPanelOpen={expandedDocPanelOpen}
						/>
					</div>
				}
			{/* Map should remain 'rendered' at all times so it isn't rebuilding entirely each time its hidden *
				<Map
					docs={docs}
					expandedDoc={expandedDoc}
					currentResultTab={currentResultTab} // tells map to display itself or not
				/> */}
				{
					currentResultTab === 'analytics' &&
					<div className='search-container__results-panel__body__analytics'>
						Insights here
						</div>
				}
				{
					<div className='search-container__results-panel__body__expandedDoc'>
						<ContentDetail
							expandedDoc={expandedDoc}
							updateExpandedDocPanel={updateExpandedDocPanel}
							expandedDocPanelOpen={expandedDocPanelOpen}
							viewMode="panel"
						/>
					</div>
				}
			</div>
		</React.Fragment>
	);
}


export default ContentResults;