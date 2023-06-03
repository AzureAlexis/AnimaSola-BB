function arraySum(x) {
	let sum = 0;
	
	for(let i = 0; i < x.length; i++) {
		sum = sum + x[i];
	}
	return sum;
}