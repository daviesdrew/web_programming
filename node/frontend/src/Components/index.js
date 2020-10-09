import React from 'react';
import Highlighter from "react-highlight-words";
import './index.css';
import * as UTIL from '../config/utils.js'
import { searchMapping } from '../config/data.js'

export const DataTable = (props) => {
	const {
		title,
		style,
		obj,
		prevSearch,
		rows
	} = props;
	return (
		UTIL.validateArray(rows) &&
		<React.Fragment>
			{ UTIL.validateValue(title) && <div className="doc-detail-panel__heading">{title}</div>}
			<div className={ style || "data-table"}>
				{ rows.map( (row) => 
					UTIL.validateValue(obj[row.attr]) && // if the document has this value
						<DataRow style={row.style} label={row.label} value={obj[row.attr]} prevSearchValues={UTIL.validatePrevSearch(prevSearch, searchMapping[row.attr])} />
				)
			}
			</div>
		</React.Fragment>
	)
};


export const CitationRow = (props) => {
	const {
		label,
		value,
		prevSearch,
		setId,
		data,
		togglePopup,
		id,
		showPopup
	} = props;
	return (
		// need to clean this up due to issue with Sourcebiblio
		UTIL.validateArray(value) &&
		<div className="data-table__row">
			<span className="data-cell--label">{label}</span>
			<span className="data-cell">
				{ value.map((item, index) => 
					<span key={'bib_cite_'+index} className="citation"> {item.pageRef && item.pageRef}
						{ UTIL.validateValue(item.source) &&  
	 						<span className="citation-link" onClick={()=> { 
								(item._id !== id) ? setId(item.source) : togglePopup(true) }}>[{index+1}]
							</span>
						}
	 				{ showPopup && 
	 					<PopUp
	 						data={data}
	 						togglePopup={togglePopup}
 						/>
	 				}
					</span>
				)}
			</span>
		</div>
	 )	
}

export const DataRow = (props) => {
		const {
			label, 
			value,
			prevSearch
		} = props;
		const processedTerms = Array.isArray(prevSearch) 
			? prevSearch.flat(Infinity) 
			: prevSearch;
	return (
		UTIL.validateValue(value) &&
		<div className="data-table__row">
			<span className="data-cell--label">
				{label}
			</span>
			{prevSearch !== undefined 
					?
				<span className="data-cell">
					<Highlighter
						highlightTag='i'
						highlightClassName='highlight'
						searchWords={processedTerms}
						autoEscape={true}
						textToHighlight={value}
						/>
				</span>
				: <span className="data-cell"> {value} </span> 
				
				}
		</div>
		)
}

export const PopUp = (props) => {
	const { 
		data,
		togglePopup 
	} = props;
	return (
		<div className="popup">
			<div className="popup_inner">
				{ data._id !== null 
					? <p>{data.title} ({data.publicationType})</p>
					: <p>No source reference found</p>
				}
			<span onClick={()=> togglePopup(false)}> Close </span></div></div>
		)
}


export const SortMenu = (props) => {
	const {
		sortFunction,
		sortOptions,
		currentSort // used to highlight
	} = props;
	return (
		 UTIL.validateArray(sortOptions) &&
				<div className="list-panel--sort-controls">
				 	{ sortOptions.map(item=>
					 	<div 
						 	className= {item.name === currentSort ? "list-panel--sort-button--active" : "list-panel--sort-button"}
						 	onClick={()=>sortFunction(item.name)}
						 	> 
						 	{item.label}
				 		</div>)
					}
				</div>
		)
}

export const DocumentHeader = (props) => {
	const {
		viewMode,
		controlFunction,
		doc,
	} = props;
	return (
		<div className="doc-header">
			{viewMode === "panel" && 
          <div className='doc-header__controls'>
              <span className="doc-header__controls--close" onClick={() => controlFunction(doc)}>
                  Close
              </span>
         </div>
         }
		   <div className="doc-header__content">
		   	{props.children}
		   </div>
	   </div>
   );
}

export const Button = (props) => {
	return (
		<button
			onClick={props.onClick}
			className={props.styleName}
		>
			{props.label}
		</button>
	);
}