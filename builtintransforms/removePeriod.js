'use strict'
/**
 * Removes . from the provided value
 * @param value - from which to remove .
 * @param intentName - the intent name, ignored here since this is a built in transform function.
 * @param slotName - the slot name, ignored here since this is a built in transform function.
 * @param slotType - the slot type, ignored here since this is a built in transform function.
 * @returns {*} either either the value with all the . removed or undefined if
 * the input is undefined or null
 */
module.exports = function(value, intentName, slotName, slotType){
	if(typeof value !== "undefined" && value !== null){
		let returnValue = value.replace(/\./g, '');
		return returnValue;
	}
	return value;
};