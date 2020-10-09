import React from 'react';
import * as ENV from '../../config/literals';
import * as UTIL from '../../config/utils';
import './index.css';
import '../doc.css';
import { ManuscriptList, ManuscriptDetail } from '../Manuscript/';
import * as DOC from '../../Components/';
import { listSortOptions } from '../../config/data.js'

const ApocryphaList = (props) => {
    const {
        listStyle,
        sortBy,
        docs,
        expandedDoc,
        expandedDocPanelOpen,
        updateExpandedDocPanel,
        sortKey
    } = props;
    const [language, setLanguage] = React.useState('latin');
    return (
        <div className="list-panel">
            <div className='list-panel--header'>
                <div className='list-panel--header-title'>Apocrypha</div>
                { sortBy && 
                    <DOC.SortMenu
                        sortFunction = { sortBy }
                        sortOptions = { listSortOptions.apocrypha }
                        currentSort = { sortKey || null }
                    />
                }
                <div onClick={()=> { language === 'english' ? setLanguage('latin') : setLanguage('english')}}>Toggle Language</div>
            </div>
            <div className='list-panel--body'>
                {UTIL.validateArray(docs)
                    ? docs.map(item =>
                        <ApocryphaListItem
                            summaryDoc = {item}
                            expandedDocId = {UTIL.validateObject(expandedDoc) ? expandedDoc._id : 0}
                            updateExpandedDocPanel = {updateExpandedDocPanel}
                            listPreferences = { { language: language }}
                        />)
                    : <p>No results</p>}
            </div>
        </div>
    );
};

const ApocryphaListItem = (props) => {
    const {
        summaryDoc,
        expandedDocId,
        updateExpandedDocPanel,
        listPreferences
    } = props;
    return (
        <div
            className={expandedDocId === summaryDoc._id ? 'list-panel--item-expanded' : 'list-panel--item'}
            key={summaryDoc._id} 
            onClick={() => updateExpandedDocPanel(summaryDoc, true)} >
            <span className="list-panel--item-text">
                { (summaryDoc.englishTitle && listPreferences.language === 'english') && summaryDoc.englishTitle }
                { (summaryDoc.latinTitle && listPreferences.language === 'latin') && summaryDoc.latinTitle }
              
            </span>
        </div>
    )
}

const ApocryphaDetail = (props) => {
    const {
        updateExpandedDocPanel,
        expandedDoc,
        expandedDocPanelOpen,
        viewMode
    } = props;
    const [overlayDoc, setOverlayDoc] = React.useState(null);
    console.log(overlayDoc);
    console.log(expandedDoc);
    return (
        UTIL.validateObject(expandedDoc) && (viewMode === 'overlay' || (viewMode==="panel" && expandedDocPanelOpen)) &&
        <div className='doc-detail-panel'>
       
            <DOC.DocumentHeader
                viewMode={viewMode}
                controlFunction={updateExpandedDocPanel}
                doc={expandedDoc}
            >
                 {/* any header content goes here */}
                <div className='doc-header__text__line'>
                    <span className='doc-header__text__item'>{expandedDoc.latinTitle}</span>
                    <span className='doc-header__text__item'>{expandedDoc.eClavis}</span>
                </div>
                <ApocryphaDetailTable
                    expandedDoc={expandedDoc}
                />
            </DOC.DocumentHeader>
            {/* end header content */}
            {/* body content -- scrollable */}
            <div className='doc-detail-panel__body'>
                <h4>Manuscripts of {expandedDoc.latinTitle}</h4>
                <div className="manuscript-list">
                { (UTIL.validateArray(expandedDoc.containedInManuscripts))
                    ? expandedDoc.containedInManuscripts.map( (ms) => 
                        <div 
                            className="list-panel--item"
                            onClick={ ()=>{setOverlayDoc(ms)}}
                        >
                            {ms.repository && <div className='list-panel--item-title'>{ms.repository}</div>}
                            {ms.shelfMark && <div className='list-panel--item-text'>Shelf Mark: {ms.shelfMark}</div>}
                            {ms.mapEvent &&<div className='list-panel--item-text'>{ms.mapEvent.city}, {ms.mapEvent.country}</div>}
                        </div>
                        )
                    : <p>No manuscripts found</p>
                }
                </div>
                {overlayDoc !== null &&
                    <div className="overlay">
                        <div class="overlay__control" onClick = {()=>setOverlayDoc(null)}>
                            <div class="leftright"></div>
                            <div class="rightleft"></div>
                            <label class="close">Close</label>
                        </div>   
                        <div className="overlay__content">
                            <ManuscriptDetail 
                                ms={overlayDoc}
                                initialApoc={expandedDoc._id}
                                viewMode="overlay"
                                prevSearch={{}} // need to find default set for this
                            />
                        </div>
                    </div>
                }
            </div>
        </div>
    );
}

const ApocryphaDetailTable = (props) => {
    const {
        expandedDoc
    } = props;
    return (
        <div>
            <p className="p-output"> Apocrypha ID:   &nbsp;  {expandedDoc._id}</p>
            <p className="p-output"> Latin Title:    &nbsp;  {expandedDoc.latinTitle}</p>
            <p className="p-output"> eClavis no:     &nbsp;  {expandedDoc.eClavis}</p>
            <p className="p-output"> BHL no:         &nbsp;  {expandedDoc.BHL}</p>
            <p className="p-output"> CANT no:        &nbsp;  {expandedDoc.CANT}</p>
        </div>
    );
}

export { ApocryphaList, ApocryphaDetail }