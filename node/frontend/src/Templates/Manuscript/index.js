import React from 'react';
import './index.css';
import '../doc.css'
import * as DOC from '../../Components/';
import * as UTIL from '../../config/utils.js';
import * as ENV from '../../config/literals.js';
import { listSortOptions } from '../../config/data.js';
import { manuscript_template } from '../../config/settings.js';
//import { DocsContext } from '../../Browse/'

const ManuscriptList = (props) => {
	const {
		sortBy, 
		docs,
		expandedDoc,
		expandedDocPanelOpen,
		updateExpandedDocPanel,
		expandedDocDisplay,
		sortKey
	} = props;
	return (
		<div className="list-panel">
			<div className='list-panel--header'>
				<div className='list-panel--header-title'>Manuscripts</div>
				{ sortBy && 
					<DOC.SortMenu
						sortFunction = { sortBy }
                 	sortOptions = { listSortOptions.manuscript }
                 	currentSort = { sortKey || null }
               />
				}
			</div>
			<div className='list-panel--body'>
				{UTIL.validateArray(docs)
					? docs.map(item =>
						<ManuscriptListItem
							summaryDoc = {item}
							expandedDocId = {UTIL.validateObject(expandedDoc) ? expandedDoc._id : 0}
							updateExpandedDocPanel = {updateExpandedDocPanel}
						/>)
					: <p>No results</p>}
			</div>
		</div>
	)
}

const ManuscriptListItem = (props) => {
	const {
		summaryDoc,
		expandedDocId,
		updateExpandedDocPanel
	} = props;
	return (
		<div 	className={expandedDocId === summaryDoc._id ? 'list-panel--item-expanded' : 'list-panel--item'}
		 		key={summaryDoc._id} 
		 		onClick={() => updateExpandedDocPanel(summaryDoc, true)} 
	 	>
			{ summaryDoc.censusId && <span className="list-panel--item-text">{summaryDoc.censusId}.</span>}
			{ summaryDoc.mapEvent && <span className='list-panel--item-text'>{summaryDoc.mapEvent.city} ({summaryDoc.mapEvent.country}) </span>}
			{ summaryDoc.repository && <span className='list-panel--item-text'>{summaryDoc.repository}</span>}
			{ summaryDoc.dateRange && <span className='list-panel--item-text'>(dated {summaryDoc.dateRange.from} - {summaryDoc.dateRange.to})</span>}
			{ summaryDoc.shelfMark && <span className='list-panel--item-text'>, {summaryDoc.shelfMark}</span>}
			{ summaryDoc.status && <span className='list-panel--item-text'>, {summaryDoc.status}</span>}
		</div>
	)
}

const ManuscriptDetail = (props) => {
	const {
		ms,
		initialApoc,
		updateExpandedDocPanel,
		expandedDocPanelOpen,
		viewMode,
		prevSearch 
	} = props;
	const [focusApoc, setFocusApoc] = React.useState(null);
	const [id, setId] = React.useState(null);
	const [data, setData] = React.useState(null);
	const [showPopup, togglePopup] = React.useState(false);
	console.log(ms);
	// will try to move this out of component 
	React.useEffect(()=> {
		if (id === null || id === '') { return; }
		let toSend = { type: 'bibliography', id: id};
		fetch(
			ENV.DB_API_SINGLE, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(toSend)
		}).then(result => result.json()).then(data=> {
			setData(data);
			togglePopup(true);
		});
	}, [id]); 
	
	// used for referencing the dom nodes for the 'scroll to' function
   const refs = UTIL.validateObject(ms) && UTIL.validateArray(ms.part)
   	? ms.part.reduce((acc, currentPart, p_i) => {
	   		if (UTIL.validateArray(currentPart.contents)) {
	   				currentPart.contents.forEach( (c,c_i) => {
	   				if (c.partContentsType === 'apocryphon' && UTIL.validateObject(c.apocryphon)) {
	   					// need to find way to make sure unique identifier
   						acc[p_i+'_'+c_i] = {
	   						ref: React.createRef(),
	   						title: c.apocryphon.latinTitle ? c.apocryphon.latinTitle : c.apocryphon.title ?  c.apocryphon.title : 'No title recorded',
	   						aid: c.apocryphon.apocryphonId ? c.apocryphon.apocryphonId : null
	   					}
			  			}
					})
	   		} 
	   		return acc;
			  },{})
		: null;

	// used to scroll to an initial apocrypha on load
	React.useEffect(()=>{
		if (initialApoc !== undefined) {
			Object.keys(refs).forEach((key) => {
				if (refs[key].aid === initialApoc) {
					refs[key].current.scrollIntoView({
						behavior: 'smooth',
						block: 'start',
					});
				}})
			}
		}
	);

	// event handler for scroll
	const handleClick = id => { 
		refs[id].current.scrollIntoView({
			behavior: 'smooth',
			block: 'start',
		});
	}

	return (
		UTIL.validateObject(ms) && (viewMode==="overlay" || (viewMode==="panel" && expandedDocPanelOpen)) &&
			<div className="doc-detail-panel">
				<DOC.DocumentHeader
					viewMode={viewMode}
					controlFunction={updateExpandedDocPanel}
					doc={ms}
				> 
			{/* any header content goes here */}
		 		<div className='doc-header__text__line'>
		 			<span className='doc-header__text__item'>{ms.mapEvent?.city && `${ms.mapEvent.city} `}</span> 
		 			<span className='doc-header__text__item'>{UTIL.validateValue(ms.mapEvent?.country) && `(${ms.mapEvent.country}), `}</span>
               <span className='doc-header__text__item'>{UTIL.validateValue(ms.repository) && `${ms.repository}, `}</span>
					<span className='doc-header__text__item'>{UTIL.validateValue(ms.shelfMark) && `${ms.shelfMark}, `}</span>
					<span className='doc-header__text__item'>{UTIL.validateValue(ms.dateRange) && `(dated ${ms.dateRange?.from} - ${ms.dateRange?.to})`}</span>
				</div>
				<div className='doc-header__content_list__title'>Apocrypha</div>
				<ul className="doc-header__content-list">
					{Object.keys(refs).map((key)=> (
						<li className="doc-header__content-list__item" key={key} onClick={()=>handleClick(key)}>{refs[key].title}</li>
					))}	
				</ul>
			{/* end header content */}
				</DOC.DocumentHeader>

				<div className="doc-detail-panel__body">
					<div className="doc-detail-panel__heading">Manuscript</div>
					<div className="doc-detail-panel__details">
						<div className="data-table">
							<DOC.DataRow label="Census no." value={ms.censusId} 
								prevSearch={UTIL.validatePrevSearch(prevSearch, 'ms_censusid')} 
							/>
							<DOC.DataRow label="City" value={ms.mapEvent?.city} 
								prevSearch={UTIL.validatePrevSearch(prevSearch, 'ms_city')}
							/>
							<DOC.DataRow label="Country" value={ms.mapEvent?.country} 
								prevSearch={UTIL.validatePrevSearch(prevSearch, 'ms_country')}
							/>
							<DOC.DataRow 
								label="Repository" value={ms.repository} 
								prevSearch={UTIL.validatePrevSearch(prevSearch, 'ms_repository')}	/>
							<DOC.DataRow 
								label="Shelfmark" value={ms.shelfMark}
								prevSearch={ UTIL.validatePrevSearch(prevSearch, 'ms_shelfmark')}
							/>
							<DOC.DataRow label="Old shelfmarks" value={ms.oldShelfMarks}
								prevSearch={ UTIL.validatePrevSearch(prevSearch, 'ms_oldshelfmarks')}
							/>
							<DOC.DataRow 
								label="Dimensions"
								value={ms.dimensions}
								prevSearch={ UTIL.validatePrevSearch(prevSearch, 'ms_dimensions')}
							/>
							<DOC.DataRow 
								label="No. of leaves/pages"
								value={ms.leavesPages}
								prevSearch={ UTIL.validatePrevSearch(prevSearch, 'ms_leavespages')}
							/>
						{/* 
							<DOC.DataRow 
								label="Date Range"
								value={ms.dateRange && {ms.dateRange.from+' - '+ms.dateRange?.to}
								prevSearch={ UTIL.validatePrevSearch(prevSearch, 'ms_daterange')}
							/>
						*/}
							<DOC.DataRow
								label="Languages"
								value={UTIL.validateArray(ms.languages) ? UTIL.bindArrayToString(ms.languages) : ''}
								prevSearch = { UTIL.validatePrevSearch(prevSearch, 'ms_languages')}
							/>
							<DOC.DataRow 
								label="Status"
								value={ms.status}
								prevSearch={ UTIL.validatePrevSearch(prevSearch, 'ms_status')}
							/>
							<DOC.DataRow 
								label="Note on ms"
								value={ms.notes}
								prevSearch={ UTIL.validatePrevSearch(prevSearch, 'ms_notes')}
							/>
	 					{ UTIL.validateArray(ms.sourceBiblio) &&
		 					<DOC.CitationRow 
								label="Bibiography" 
								value={ms.sourceBiblio}
								setId={setId}
								data={data}
								togglePopup={togglePopup}
								id={id}
								showPopup={showPopup}
							/>
						}
							<DOC.DataRow 
								label="Correspondence"
								value={ms.correspondence}
								prevSearch={ UTIL.validatePrevSearch(prevSearch, 'ms_correspondence')}
							/>
							<DOC.DataRow 
								label="Correspondent"
								value={ms.correspondent}
								prevSearch={ UTIL.validatePrevSearch(prevSearch, 'ms_correspondent')}
							/>
						</div>
					</div>
					<div className="doc-detail-panel__heading">Contents</div>
					<div className="manuscript-parts">	
					{UTIL.validateArray(ms.part) &&
						 	ms.part.map((part, p_index) => 
								UTIL.validateArray(part.contents) &&
										<div className="manuscript-parts__part">
											<div className="manuscript-parts__part__index">
												Part {p_index+1}
											</div>
										 	{ part.contents.map((item, c_index) => 
												(item.partContentsType === 'apocryphon') 
												? 	<ApocryphonDetail
														ref = {refs[p_index+'_'+c_index]} apoc={item.apocryphon}
														p_index={p_index} c_index={c_index}
														prevSearch={prevSearch} id={id}
														setId={setId} data={data}
														setData={setData} showPopup={showPopup}
														togglePopup={togglePopup}
													/>
												: (item.partContentsType) && 
													<OtherContent
														contentType={item.partContentsType}
														content={item.notApocryphon}
													/>
												)
										 	}	
								 	</div>
							)
					}
					</div>
				</div>
			</div>
	);
}

const OtherContent = (props) => {
	const {
		contentType,
		content
	} = props;
	return(
		<div className='manuscript__otherContent'>
			 {contentType}: {content}
		</div>
	);
}

const ApocryphonDetail = React.forwardRef((props, ref) => {
	const { 
		apoc, p_index, c_index, prevSearch, id, setId,
		data, setData, showPopup, togglePopup,
	} = props;
	return (
		<div className="manuscript__apocryphon" ref={ref} key={apoc._id}>
			<div className="manuscript__apocryphon__header">
				<span className="manuscript__apocryphon__header__index">({c_index+1}) </span>
				<span className="manuscript__apocryphon__header__title">{apoc.latinTitle ? apoc.latinTitle : apoc.title ?  apoc.title : 'No title recorded'}
				</span>
			</div>
			<div className="data-table">
				<DOC.DataRow 
					label="Language"
					value={apoc.language} 
					prevSearch={UTIL.validatePrevSearch(prevSearch, 'apoc_language')}
				/>
				<DOC.DataRow 
					label="Date Range"
					value={UTIL.validateObject(apoc.date) ? apoc.date.from+' - '+apoc.date.to+(apoc.date.notes ? '('+apoc.date.notes+')' : '') : ''}
					prevSearch={UTIL.validatePrevSearch(prevSearch, 'apoc_daterange')}
				/>
				<DOC.DataRow 
					label="MS Title"
					value={apoc.msTitle} 
					prevSearch={ UTIL.validatePrevSearch(prevSearch, 'apoc_mstitle') }
				/>
				<DOC.DataRow 
					label="Extent"
					value={apoc.extent} 
					prevSearch={UTIL.validatePrevSearch(prevSearch, 'apoc_extent')}
				/>
				<DOC.DataRow 
					label="Ffpp"
					value={apoc.ffpp} 
					prevSearch={UTIL.validatePrevSearch(prevSearch, 'apoc_ffpp')}
				/>
				<DOC.DataRow 
					label="Version"
					value={apoc.version} 
					prevSearch={UTIL.validatePrevSearch(prevSearch, 'apoc_version')}
				/>
				<DOC.DataRow 
					label="Colophon"
					value={apoc.colophon} 
					prevSearch={UTIL.validatePrevSearch(prevSearch, 'apoc_colophon')}
				/>
			</div>
			{UTIL.validateArray(apoc.section) &&
				<React.Fragment>
				<div className="manuscript__apocryphon__heading">Sections</div>
					{ apoc.section.map( (s, index) => 
						<div className="manuscript__apocryphon__section" key={index}>
							<div className="manuscript__apocryphon__section__heading">Section {index+1} {s.name && '('+s.name+')'}</div>
							<div className="data-table">
								<DOC.DataRow 
									label="pf. Explicit"
									value={s.pfExplicit} 
									prevSearch={UTIL.validatePrevSearch(prevSearch, 'apoc_pfexplicit')}
								/>
								<DOC.DataRow 
									label="Explicit"
									value={s.explicit} 
									prevSearch={UTIL.validatePrevSearch(prevSearch, 'apoc_explicit')}
								/>
								<DOC.DataRow 
									label="pf. Incipit"
									value={s.pfIncipit} 
									prevSearch={UTIL.validatePrevSearch(prevSearch, 'apoc_pfincipit')}
								/>
								<DOC.DataRow 
									label="Incipit"
									value={s.incipit} 
									prevSearch={UTIL.validatePrevSearch(prevSearch, 'apoc_incipit')}
								/>
							</div>
						</div>
						)}
				</React.Fragment>
			}
			<div className="data-table">
				{ (UTIL.validateObject(apoc.origin) && UTIL.validateArray(apoc.origin)) && 
					<DOC.DataRow
						label="Origin"
						value={UTIL.bindArrayToString([ apoc.origin.region, apoc.origin.institution, apoc.origin.diocese, apoc.origin.place, apoc.origin.order, apoc.origin.person, apoc.origin.notes], ',')}
						prevSearch={UTIL.validatePrevSearch(prevSearch, 'apoc_origin')}
					/>
				}
			 	{ UTIL.validateArray(apoc.provenance) &&
			 		apoc.provenance.map((item, index) => 
			 			UTIL.validateObject(item) &&
			 			<DOC.DataRow
			 				label={ 'Provenance ('+(index+1)+')' }
			 				value={ UTIL.bindArrayToString([item.region, item.institution, item.diocese, item.place, item.order, item.person, item.notes], ',')}
			 				prevSearch={UTIL.validatePrevSearch(prevSearch, 'apoc_provenance')}
		 				/>
		 			)
			 	}
			 	{ UTIL.validateArray(apoc.scribe) &&
	 				 apoc.scribe.map((scr, index) =>
	 				 	 UTIL.validateObject(scr) && 
	 				 		<DOC.DataRow
	 				 			label={ 'Scribe ('+(index+1)+')'}
	 				 			value={UTIL.bindArrayToString([scr.name, scr.signature, scr.notes], ',')}
	 				 			prevSearch={UTIL.validatePrevSearch(prevSearch, 'apoc_scribe')}
 				 			/>
					)
			 	}
	 			{ UTIL.validateArray(apoc.editedIn) &&
 					<DOC.CitationRow 
						label="Used for edition by" 
						value={apoc.editedIn}
						setId={setId}
						data={data}
						togglePopup={togglePopup}
						id={id}
						showPopup={showPopup}
					/>
				}
	 			{ UTIL.validateArray(apoc.inventoriedIn) &&
 					<DOC.CitationRow 
						label="Inventoried by" 
						value={apoc.editedIn}
						setId={setId}
						data={data}
						togglePopup={togglePopup}
						id={id}
						showPopup={showPopup}
					/>
				}
 			</div>
		</div>	 	
	)
})

export { ManuscriptList, ManuscriptDetail }
