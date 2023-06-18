/*
	This file (script.js) contains the script of the game
	It also creates contains a few functions that make displaying text easier and more *stylish*
*/

// The whole damn script
const LINEWIDTH = 50;
var waiting = false;
var start;
var end;
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
		"You couldn't open the door. It's not locked, but Esper refuses to open it",
		"You hear a faint click",
		["A shadowy door stands before you", ["Open", "=>"]]
	]
];

var story = [];
for(i = 0; i < 1000; i++) {
	story[i] = 0;
}

function formatText(x, y = 0) {
	let output = x;
	if(x.indexOf("\n") == -1) {
		for(let i = LINEWIDTH; i < x.length; i = i + LINEWIDTH) {
			output = output.substring(0, i + (i / LINEWIDTH * 2) - 2) + "\n" + output.substring(i + (i / LINEWIDTH * 2) - 2);
		}
	}
	for(let i = output.length; i < 150; i = i + LINEWIDTH) {
		output = output + "\n";
	}
	output = output + "\\c[8]Esper:";
	
	return output;
}

function runChoice(x, y, n) {
	console.log(y);
	switch(y) {
	case 1:
		console.log(x);
		switch(x) {
		case 16:
			movePlayer(8, 6, 2, 0);
			break;
		}
	}
}

// Formats text and shows it with the in game windows
// If the parameter is an array, a choice is presented instead
function mapText(x, y = $gameMap._mapId) {
	let z = script[y][x];
	
	$gameMessage.setBackground(2);
	$gameMessage.setPositionType(2);
	$gameMessage.setChoiceBackground(2);
	$gameMessage.setChoicePositionType(1);
	
	if(Array.isArray(z)) {
		let z2 = z[1];
		$gameMessage.add(formatText(z[0]), 1);
		$gameMessage.setChoices(z2, 0);
		$gameMessage.setChoiceCallback(function(n){runChoice(x, y, n)});
	} else {
		$gameMessage.add(formatText(z));
		$gameMessage.setChoices(["=>"], 0);
	}
	$gameMap._interpreter.setWaitMode('message');
}
function massText(x, y = x) {
	$gameVariables.setValue(3, x);
	$gameVariables.setValue(4, y);
	$gameMap._interpreter._params = [4];
	$gameMap._interpreter.command117();
}

function storyText(x, y = x) {
	if(story[$gameMap._mapId] < x) {
		massText(x, y);
		story[$gameMap._mapId] = x;
	}
}

function storyTick(x = 1) {
	story[$gameMap._mapId] = story[$gameMap._mapId] + x;
}