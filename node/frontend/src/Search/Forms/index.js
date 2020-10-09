import React from 'react';
import './index.css';
import * as UTIL from '../../config/utils.js'
import { searchDefaults, newFieldOptions } from '../../config/data.js'

const SearchForm = (props) => {
	const {
		initiateSearch,
		handleInputChange,
		toggleSearchPanel,
		isSearching,
		searchPanelOpen,
		searchFields,
		updateSearchFields,
		handleFieldConnectiveChange,
	} = props;

	// local state --> newField keeps track of uncommitted new search field
	// setNewField --> function that sends SearchView the newly added field and cleans up view after
	const [newField, setNewField] = React.useState(null); // default is null (no new field to consider)

	React.useEffect(()=> { });
	console.log(searchFields);
	return (
		searchPanelOpen && UTIL.validateValue(isSearching) && UTIL.validateValue(searchFields)
		?  // if searchPanelDisplayed, render
			<div className='search-container__search-panel' key={isSearching}>
			<h3>Search {isSearching}</h3>
				<h4>Search Fields</h4>
				<div className='search-container__field-options'>
					{ UTIL.validateObject(newFieldOptions[isSearching]) && 
						newFieldOptions[isSearching].map(item => 
							(UTIL.validateObject(searchFields) && searchFields[item.name] === undefined) &&
								<div 
									className='search-container__field-options__field'
									value={JSON.stringify(item)}
									onClick={()=> { 
										updateSearchFields('add', false, item); // commit to SearchView State
										setNewField(null); // refresh react hook state 
									}}
								> 
									{item.label}
								</div>
						)
					}
				</div>
				{ 	Object.keys(searchFields).length !== 0 &&
						// for each item in searchFields, map out the result
						Object.keys(searchFields).map(entry =>
							entry !== 'connective' && 
							( searchFields[entry].type === 'text' 
								? 
								<TextField 
									handleInputChange={handleInputChange}
									handleFieldConnectiveChange={handleFieldConnectiveChange}
									updateSearchFields={updateSearchFields}
									field={searchFields[entry]}
								/>
								: searchFields[entry].type ==='select' &&
								<SelectField
									handleInputChange={handleInputChange}
									handleFieldConnectiveChange={handleFieldConnectiveChange}
									updateSearchFields={updateSearchFields}
									field={searchFields[entry]}
									/>
							))
				}
			   	<div className='field-connective'>
			   	{ UTIL.validateObject(searchFields.connective) &&
			   		 searchFields.connective.value === 'or'
			   		?
		   				<span className="field-connective__button" onClick={()=> handleInputChange('connective', 'and')}>
	   						Return results that match all fields
		   				</span>
	   				: 
		   				<span className="field-connective__button--active" onClick={()=> handleInputChange('connective', 'or')}>
	   						Return results that match all fields
		   				</span>
	   			}
   				</div>
				<button className='search-button' onClick={initiateSearch}>
					Search
				</button>
			</div>
			: // search panel is CLOSED / collapsed
			<div className='search-container__search-panel--collapsed'
				onClick={() => toggleSearchPanel()}>
				Back to Search
			</div>
	);
}

const TextField = (props) => {
	const {
		handleInputChange,
		handleFieldConnectiveChange,
		updateSearchFields,
		field,
	} = props;
	const [terms, setTerms] = React.useState(field.value); // set the list of tags
	const [inputValue, setInputValue] = React.useState(''); // handle non-tag input
	const [editMode, toggleEditMode] = React.useState(false); // for removing field

	const removeTerm= (i) => {
		handleInputChange(field.name, [...terms].splice(0, terms.length-1));
		const newTerms = [ ...terms ];
		newTerms.splice(i, 1);
		setTerms(newTerms);
	}
	const localHandleChange = (e) => {
		const tempVal = e.target.value;
		if ((e.key === ',' || e.key==='Enter') && tempVal) {
			if (terms.find(term => term.toLowerCase()===tempVal.toLowerCase())) {
				return; // tag already there
			}
			// else add to tags
			setTerms([...terms, tempVal]);
			setInputValue(''); // reset it to nothing
			handleInputChange(field.name, [...terms, tempVal]);
		} else if (e.key === 'Backspace' && !tempVal) {
			handleInputChange(field.name, [...terms].splice(0, terms.length-1));
			removeTerm(terms.length-1);
		} else {
			setInputValue(tempVal);
			handleInputChange(field.name, [...terms, tempVal]);
		}
	}

	return (
		editMode
			?	
			<div className="formField formField--editing">
				🗑️ Remove {field.label} field?
					<span className='formField__button cancel' onClick={()=> { toggleEditMode(false);}}>
						Cancel
					</span>
					<span className='formField__button confirm' onClick={()=> { updateSearchFields('remove', field, false); toggleEditMode(false);}}>Remove
					</span>
			</div>
			:  
			<React.Fragment>
				<div className="search-field">
					<span className="search-field__label">{field.label}:</span>
				   <div className="tagged-input-field">
				     <ul className="tagged-input-field__list">
				       { terms.map((term, i) => (
				         <li key={term}>
				           {term}
				           <button type="button" onClick={() => { removeTerm(i); }}>+</button>
				         </li>
				       ))}
				       <li className="tagged-input">
				       	<input type="text" 
				       		maxLength="50"
				       		onKeyDown={(e)=> 
				       			(e.key === 'Enter' || e.key==='Backspace') && localHandleChange(e)}
				       			onChange={(e)=> localHandleChange(e) } value={inputValue} 
				       	/>
				       	</li>
				     </ul>
				   </div>
				   <span 
						className='search-field__edit-button' 
						onClick={()=> {toggleEditMode(true);}
					}>❌</span>
				</div>
			   { field.fieldconnective !== 'ignore' && 
			   	<div className='field-connective'>
			   		{ field.fieldconnective === 'in'
			   		?
	   				<span className="field-connective__button" onClick={()=> handleFieldConnectiveChange(field.name, 'all')}>
   						Match all terms
	   				</span>
	   				: 
	   				<span className="field-connective__button--active" onClick={()=> handleFieldConnectiveChange(field.name, 'in')}>
   						Match all terms
	   				</span>
	   			}
   				</div>
		   	}
		   </React.Fragment>
    );
 }

const SelectField = (props) => {
	const  {
		handleInputChange,
		handleFieldConnectiveChange,
		updateSearchFields,
		field,
	} = props;
	const [editMode, toggleEditMode] = React.useState(false); // for removing field
	return (
		editMode
			?	
			<div className="formField formField--editing">🗑️ Remove {field.label} field?
					<span 
						className='formField__button cancel' 
						onClick={()=> { 
							toggleEditMode(false);
						}}>
						Cancel
					</span>
					<span 
						className='formField__button confirm' 
						onClick={()=> { 
							updateSearchFields('remove', field, false);
							toggleEditMode(false);
						}}>Remove
					</span>
			</div>
			:  
				<div className="search-field">
					<div className="search-field__label">{field.label}:</div>
					<div className="search-field__select">
						<select
							name={field.name}
							type='select'
							defaultValue={field.options[0].opt_name}
							onChange={event => handleInputChange(field.name, event.target.value)}
						>
							<option disabled>Select {field.label} results</option>
							{ field.options.map(item =>
								<option value={item.opt_name}> {item.opt_label} </option>
							)}
						</select>
					</div>
					 <div className='search-field__edit-button' onClick={()=> toggleEditMode(true)}>❌</div>
				 </div>
			);
}

export { SearchForm };