// Append this code to the end of app.js 

/** - define an array of objects 
 *  - each object represets one motion responce 
 *  - you have to change the list of attributes to match your design
 *  - you might need to add more objects to test complex scenarios
 */
var data = [{
  id: 1,
  type: 'led',
  action: 'off',
  time: 1
}, {
  id: 2,
  type: 'led',
  action: 'on',
  time: 2
}, {
  id: 3,
  type: 'motion',
  action: 'off',
  time: 3
}, {
  id: 4,
  type: 'motion',
  action: 'on',
  time: 4
}];

var index = 0; //index for array data
/**
 * The setInterval() method calls a function or evaluates an expression at specified intervals (in milliseconds).
   The setInterval() method will continue calling the function until clearInterval() is called, or the window is closed.
   The ID value returned by setInterval() is used as the parameter for the clearInterval() method.
*/
var pnt = setInterval(function () { //pnt pointer to setInterval
  ref.push(data[index]);
  index++; // increate the index by one
  console.log('index='+index)
  if (index == data.length)
    clearInterval(pnt);
}, 1000); // delay is 1000ms
