/*
	This file (script.js) contains the script of the game
	It also creates contains a few functions that make displaying text easier and more *stylish*
*/

// The max character width for each textbox line
const LINEWIDTH = 50;

/*
	The story array indicates where the player is in the plot in each map
	The for loop right below it sets all values from 0-999 to 0, initilizing the array
*/
var story = [];
for(i = 0; i < 1000; i++) {
	story[i] = 0;
}

/*
	runChoice: Contains all possible outcomes of all choices in the script
	
	@param	x: The map to pull from
			y: The script line to pull from
			n: Which choice the player selected
	@return	void
	
*/
function runChoice(x, y, n) {
	// console.log(x + " " + y + " " + n); // Debug use only
	switch(x) {
	case 1:
		switch(x) {
		case 16:
			switch(n) {
			case 0:
				warpPlayer(8, 6, 2, 0);
			case 1:
				mapText(0, 0);
			}
		}
	}
}

/* 
	Formats text before printing it, adding line breaks and "Esper: " at the end
	If the passed string already has line breaks, the function doesn't add more
	
	@param	x: The string to Formats
	@return	The formatted string
*/
function formatText(x) {
	let output = x;
	
	if(x.indexOf("\n") == -1) {
		for(let i = LINEWIDTH; i < x.length; i = i + LINEWIDTH) {
			output = output.substring(0, i + (i / LINEWIDTH * 2) - 2) + "\n" + output.substring(i + (i / LINEWIDTH * 2) - 2);
		}
		
		for(let i = output.length; i < 150; i = i + LINEWIDTH) {
		output = output + "\n";
		}
	}
	
	output = output + "\\c[8]Esper:";
	
	return output;
}

/*
	Displays a single line of text, pulled from the chosen map's script
	If the selected line contains a choice, executes runChoice based on selected choice and params
	
	@param	x: The line to pull from the script of the selected map
			y: The map to pull script from (Default: Current map)
	@return	void
*/
function mapText(x, y = $gameMap._mapId) {
	let z = script[y][x];
	
	$gameMessage.newPage();
	
	$gameMessage.setBackground(2);
	$gameMessage.setPositionType(2);
	$gameMessage.setChoiceBackground(2);
	$gameMessage.setChoicePositionType(1);
	
	if(Array.isArray(z)) {
		let z2 = z[1];
		$gameMessage.add(formatText(z[0]), 1);
		$gameMessage.setChoices(z2, 0, -2);
		$gameMessage.setChoiceCallback(function(n){runChoice(x, y, n)});
	} else {
		$gameMessage.add(formatText(z));
		$gameMessage.setChoices(["=>"], 0, -2);
	}
	$gameMap._interpreter.setWaitMode('message');
	
	return 
}