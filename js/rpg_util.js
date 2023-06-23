/*
	General functions that I made that can be used in any Javascript based rpg game
	*says this while having published zero games :p*
*/

// Directions for easy refrence
const up = 2;
const left = 4;
const right = 6;
const down = 8;

/*
	Moves the player to a specific position on a map
	
	@param	x: x pos to move to
			y: y pos to move to
			z: Direction the player will be facing after movement (Default: 2)
			map: The map the player will be moved to, if not null (Default: Don't change map)
			fade: The fade affect to apply to the screen. 0 = black, 1 = white, 2 = none (Default: 2)
	@return Position player is moved to
*/
function warpPlayer(x, y, z = 2, map = $gameMap._mapId, dir = 2, fade = 2) {
	$gamePlayer.reserveTransfer(map, x, y, 2, fade);
	return x + " " + y
}

/*
	Moves the specified event or player by the given units
	
	@param	x: Amount of units to shift the target on the x axis
			y: Amount of units to shift the target on the y axis
			target: The player/event to move, -1 for player, id for event (Default: -1)
			wait: Whether the game will wait for the move to finish or not
			z: Direction the target will be facing after the move (Default: null)
*/

/*
	Moves the specified player or specified event
	
	@param	route: The movements to perform, in the format of an array. Each unit in the array contains an array with the following:
				count: amount of units to move
				dir: the direction to move in
			target: The player/event to move. -1 for player, id for event (Default: -1)
			wait: Whether to wait for the route to finish or not (Default: true)
*/
function moveRoute(route, target, wait) {
	let list = []

	if(target == -1) {
		target = $gamePlayer;
	} else {
		target = $gameMap.event(target)
	}
	
	for(let i = 0; i < route.length; i++) {
		switch(list[i][1]) {
		case 2:
			list.push(Game_Character.ROUTE_MOVE_UP);
			break;
		case 4:
			list.push(Game_Character.ROUTE_MOVE_LEFT);
			break;
		}
	}
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