/*
	Returns the sum of all values in an Array
	
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

/*
	Moves the player to a specific position on a map
	
	@param	x: x pos to move to
			y: y pos to move to
			z: Direction the player will be facing after movement (Default: 2)
			map: The map the player will be moved to, if not null (Default: Don't change map)
			fade: The fade affect to apply to the screen. 0 = black, 1 = white, 2 = none (Default: 2)
	@return Position player is moved to
*/
function movePlayer(x, y, z = 2, map = $gameMap._mapId, fade = 2) {
	$gamePlayer.reserveTransfer(map, x, y, 2, 2);
	return x + " " + y
}

/*
	Makes the player jump, based on the direction they're facing
	@param	void
	@return	void
*/
function jump() {
	let x = 0;
	let y = 0;
	let dir = $gamePlayer.direction();
	
	if(dir == 2) {
		y = 2;
	} else if(dir == 4) {
		x = 2;
	} else if(dir == 6) {
		x = -2;
	} else if(dir == 8) {
		y = -2;
	}
	
	$gamePlayer.jump(x, y);
	$gameMap._interpreter.setWaitMode('jumping');
}