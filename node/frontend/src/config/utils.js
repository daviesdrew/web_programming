import React from 'react';

export const validateObject = (o) => {
	if (o !== null && o !== undefined && typeof o === 'object' && Object.keys(o).length > 0) return true;
	return false;
}

export const validateValue = (v) => {
	if (v !== null && v !== undefined && v !== '') return true;
	return false;
}

export const validateArray = (a) => {
	if (a !== null && a !== undefined && Array.isArray(a) && a.length > 0) return true;
	return false;
}

export const bindArrayToString = (arr, separator) => {
	let clean = arr.filter((item) => (item !== undefined && item !== null && item !== ''));
	return clean.join(separator);
}

export const validatePrevSearch = (prevSearch, expectedProp) => {
	if (validateObject(prevSearch)) {
		if (validateObject(prevSearch[expectedProp])) {
			if (validateValue(prevSearch[expectedProp].value)) {
				return prevSearch[expectedProp].value;
			} else {
				return [];
			}
		}
	}
}

export const mapToSearch = (category, name) => {

}

export const processObject = (obj) => {
	const isObject = val =>
        typeof val === 'object' && !Array.isArray(val);

    const addDelimiter = (a, b) =>
        a ? `${a}.${b}` : b;

    const paths = (obj = {}, head = '') => {
        return Object.entries(obj)
            .reduce((product, [key, value]) => 
                {
                    let fullPath = addDelimiter(head, key)
                    return isObject(value) ?
                        product.concat(paths(value, fullPath))
                    : product.concat(fullPath)
                }, []);
    }

    return paths(obj);
}




