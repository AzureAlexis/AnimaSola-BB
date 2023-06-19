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
	The whole damn script, contained in a 3d array
	
	x diam:	The map to pull text for
	y diam: The line in the selected map's script to pull
	z diam: Used only if the selected x and y coordinates contain a choice
			The string in this diam contains the text to be displayed
			The array contains the choices to display.
*/
var script = [
	[
		["", ["Skill", "Item", "Equip", "Info", "System"]]
	],[ // 001 Intro 1
		"",
		["", ["Rise up", "DEBUG"]],
		"You've never seen any place like this before...",
		"It's so dark...",
		"However, you remember something...",
		"You instinctively reach out, and...",
		"You got UMBRELLA KEYRING!",
		"You equipped UMBRELLA KEYRING!",
		"You got FADED UMBRELLA!",
		"You equipped FADED UMBRELLA!",
		"You got FADED DICE!",
		"You equipped FADED DICE!",
		"You got STRANGE KEYRING!",
		"You equipped STRANGE KEYRING!",
		"You couldn't open the door.  It's not locked, but Esper refuses to open it",
		"You hear a faint click",
		["", ["Open", "=>"]]
	]
];

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
				movePlayer(8, 6, 2, 0);
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

/*
	Displays one or more lines of text, by repeatadly calling mapText
	
	@param	x: Position to start at
			y: Position to end at (Default: x)
*/
var start;
var end;
function massText(x, y = x) {
	$gameVariables.setValue(3, x);
	$gameVariables.setValue(4, y);
	$gameMap._interpreter._params = [4];
	$gameMap._interpreter.command117();
}

/*
	Displays one or more lines of text if x is greater than the story value of the selected map
	If text is displayed, sets the value of the checked story value to y
	
	@param	x: The number to check the story value against. If true, text is displayed starting at x
			y: The value the checked story value is set to if true, and the last line of text to display if true (Default: x)
			z: The map to check the story value of (Default: Current map)
	@return 
*/
function storyText(x, y = x, z = $gameMap._mapId) {
	if(story[z] < x) {
		massText(x, y, z);
		story[z] = y;
		return true;
	} else {
		return false;
	}
}

/*
	Changes the player's story value
	If no params are passed, increases the current map's story value by 1
	
	@param	x: Amount to change the selected story value by (Default: 1)
			y: Which map to change the story value of (Default: Current map)
	@return	The modified story value
*/
function storyTick(x = 1, y = $gameMap._mapId) {
	story[y] = story[y] + x;
	return story[y];
}
