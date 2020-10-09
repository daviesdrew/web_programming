import React from 'react';
import './index.css';
import { ManuscriptList, ManuscriptDetail } from '../../../Templates/Manuscript/';
import Map from '../../../Map/';

const ManuscriptResults = (props) => {
	const {
		sortBy,
		docs,
		expandedDoc,
		expandedDocPanelOpen,
		updateExpandedDocPanel,
		prevSearchFields
	} = props;
	const [currentResultTab, handleResultNav] = React.useState('list');
	return (
		<React.Fragment>
			<div className='search-results__top-nav'>
				<div
					className={'search-results__top-nav__tab' + (currentResultTab === 'list' ? '--active' : '')}
					onClick={() =>  handleResultNav('list')}>
					List
					</div>
				<div
					className={'search-results__top-nav__tab' + (currentResultTab === 'map' ? '--active' : '')}
					onClick={() => handleResultNav('map')}>
					Map
				</div>
			</div>
			<div className='search-results__body'>
			{ currentResultTab === 'list' &&
					<ManuscriptList
						sortBy={sortBy}
						docs={docs}
						expandedDoc={expandedDoc}
						updateExpandedDocPanel={updateExpandedDocPanel}
						expandedDocPanelOpen={expandedDocPanelOpen}
					/>
			}
			
			{/*
				currentResultTab === 'map' &&
			<Map
				//docs={docs}
				//expandedDoc={expandedDoc}
				//currentResultTab={currentResultTab} 
				//updateExpandedDocPanel={updateExpandedDocPanel}
			/>
			*/}
			
				{
					<ManuscriptDetail
						ms={expandedDoc}
						viewMode="panel"
						updateExpandedDocPanel={updateExpandedDocPanel}
						expandedDocPanelOpen={expandedDocPanelOpen}
						prevSearch={prevSearchFields}
					/>
				}
			</div>
		</React.Fragment>
	);
}


export default ManuscriptResults;