import React from 'react';
import * as ENV from '../../config/literals';
import * as UTIL from '../../config/utils';
import * as DOC from '../../Components/';
import { listSortOptions } from '../../config/data.js';
import { bibliography_template } from '../../config/settings';
import './index.css';
import '../doc.css';

const BibliographyList = (props) => {
    const {
        listStyle,
        sortBy,
        docs,
        expandedDoc,
        expandedDocPanelOpen,
        updateExpandedDocPanel,
        sortKey
    } = props;
    return (
        <div className='list-panel'>
            <div className='list-panel--header'>
                <div className='list-panel--header-title'>Bibliographies</div>
                { sortBy && 
                <DOC.SortMenu
                    sortFunction={sortBy}
                    sortOptions={listSortOptions.bibliography}
                    currentSort={sortKey || null}
                    />
                }
            </div>
            <div className='list-panel--body'>
                {UTIL.validateArray(docs) 
                    ? docs.map(item =>
                    <BibliographyListItem
                        summaryDoc={item}
                        expandedDocId = {UTIL.validateObject(expandedDoc) ? expandedDoc._id : 0}
                        updateExpandedDocPanel = {updateExpandedDocPanel}
                    />)
                    :<p>No results</p>
                }
            </div>
        </div>
    );
};

const BibliographyListItem = (props) => {
    const {
        summaryDoc,
        expandedDocId,
        updateExpandedDocPanel,
    } = props;
    return (
        <div
            className={expandedDocId === summaryDoc._id ? 'list-panel--item-expanded' : 'list-panel--item'}
            key={summaryDoc._id} 
            onClick={() => updateExpandedDocPanel(summaryDoc, true)} 
        > 
        {summaryDoc.title && <span className="list-panel--item-text"> {summaryDoc.title} </span> }
        {summaryDoc.author && <span className="list-panel--item-text"> {(summaryDoc.author[0] ? bindAuthors(summaryDoc.author) : ENV.MISSING_INFO)}</span>}
        {summaryDoc.year && <span className='list-panel--item-text'> ({ summaryDoc.year })</span>}
        </div>
    )
}

const BibliographyDetail = (props) => {
    const {
        expandedDoc,
        updateExpandedDocPanel,
        expandedDocPanelOpen,
        viewMode,
        prevSearch
    } = props;
    console.log(props);
    return (
        (UTIL.validateObject(expandedDoc) && expandedDocPanelOpen) && 
         <div className='doc-detail-panel'>
       
            <DOC.DocumentHeader
                viewMode={viewMode}
                controlFunction={updateExpandedDocPanel}
                doc={expandedDoc}
            >
                 {/* any header content goes here */}
                <div className='doc-header__text__line'>
                    <span className='doc-header__text__item'>{expandedDoc.title}</span>
                    <span className='doc-header__text__item'>{expandedDoc.year}</span>
                </div>
            </DOC.DocumentHeader>
            {/* end header content */}
            {/* body content -- scrollable */}
            <div className='doc-detail-panel__body'>
                <h4>Bibliography Details</h4>
                    <p>Bibliography details</p>
            </div>
        </div>
    ); 
}

function bindAuthors(authorObj) {
    var bindedString = '';

    for (var i = 0; i < authorObj.length; i++) {
        bindedString += (authorObj[i].first + ' ' + authorObj[i].last);
        if (i < (authorObj.length - 1))
            bindedString += ', ';
    }
    return bindedString;
}



export { BibliographyList, BibliographyDetail }