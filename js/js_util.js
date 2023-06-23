/*
	My general functions for javascript stuff that I use basicly everywhere
	This version only includes functions that are used in the program this is included in
*/

/*
	Returns the sum of all values in a passed array
	
	@param	x: The array to add
	@return	The sum of all values of x
*/
function arraySum(x) {
	let sum = 0;
	
	for(let i = 0; i < x.length; i++) {
		sum = sum + x[i];
	}
	return sum;
}