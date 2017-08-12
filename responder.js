/*
@author Ilya Shubentsov

MIT License

Copyright (c) 2017 Ilya Shubentsov

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
'use strict'

let responder = {};

let _produceResult = function(matchedIntent, stateAccessor, applicationState, responderSpec){
  if(typeof responderSpec === "undefined" || responderSpec === null){
    return;
  }
  if(typeof responderSpec.functionSource === "string"){
    let scratchFunc = new Function('scratchFunc', responderSpec.functionSource);
    let result = scratchFunc(matchedIntent, stateAccessor, applicationState);
    return result;
  }
  else if(typeof responderSpec.directValue !== "undefined"){
    return responderSpec.directValue;
  }
  else if(typeof responderSpec.directValues !== "undefined"){
    let directValues = responderSpec.directValues;
    if(directValues.pickMethod === "random"){
      if(typeof directValues.values !== "undefined" && Array.isArray(directValues.values)){
        let randomIndex = Math.floor(Math.random() * directValues.values.length);
        return directValues.values[randomIndex];
      }
    }
    else if(directValues.pickMethod === "randomDoNotRepeat"){
      if(typeof directValues.values !== "undefined" && Array.isArray(directValues.values) &&
         typeof directValues.repeatSelector !== "undefined" && directValues.repeatSelector !== null){
        let usedValues = stateAccessor.getState(applicationState, directValues.repeatSelector);
//        console.log("usedValues: ", JSON.stringify(usedValues));
        let unusedValues = [];
        let stringifiedUsedValues = [];
        for(let i = 0; i < usedValues.length; i ++){
          stringifiedUsedValues.push(JSON.stringify(usedValues[i]));
        }
        for(let i = 0; i < directValues.values.length; i++){
          if(stringifiedUsedValues.indexOf(JSON.stringify(directValues.values[i])) < 0){
//            console.log("adding to unusedValues: ", JSON.stringify(directValues.values[i]));
            unusedValues.push(directValues.values[i]);
          }
        }
//        console.log("unusedValues: ", JSON.stringify(unusedValues));
        let randomIndex = Math.floor(Math.random() * unusedValues.length);
        let returnValue = unusedValues[randomIndex];
        usedValues.push(returnValue);
        stateAccessor.setState(applicationState, directValues.repeatSelector, usedValues);
        return returnValue;
      }
    }
  }

};

responder.produceResult = _produceResult;

module.exports = responder;
