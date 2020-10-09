import React from 'react';
import './index.css';
import { ApocryphaList, ApocryphaDetail } from '../../../Apocrypha/';

const ApocryphaResults = (props) => {
	const {
		sortBy,
		docs,
		expandedDoc,
		expandedDocPanelOpen,
		updateExpandedDocPanel,
	} = props;
	const [currentResultTab, handleResultNav] = React.useState('list');
	return (
		<div className='search-container__results-panel'>
			<div className='search-container__results-panel__top-nav'>
				<div
					className={'search-container__results-panel__top-nav__tab' + (currentResultTab === 'list' ? '--active' : '')}
					onClick={() => handleResultNav('list')}>
					List
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
						<ApocryphaList
							listStyle='list-panel--search'
							sortBy={sortBy}
							docs={docs}
							expandedDoc={expandedDoc}
							updateExpandedDocPanel={updateExpandedDocPanel}
							expandedDocPanelOpen={expandedDocPanelOpen}
						/>
					</div>
				}
				{
					currentResultTab === 'analytics' &&
					<div className='search-container__results-panel__body__analytics'>
						Insights here
					</div>
				}
				{
					<div className='search-container__results-panel__body__expandedDoc'>
						<ApocryphaDetail
							expandedDoc={expandedDoc}
							updateExpandedDocPanel={updateExpandedDocPanel}
							expandedDocPanelOpen={expandedDocPanelOpen}
							viewMode="panel"
						/>
					</div>
				}
			</div>
		</div>
	);
}

export default ApocryphaResults;