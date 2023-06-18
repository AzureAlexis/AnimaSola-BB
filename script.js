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
		"test"
	],[ // 001 Intro 1
		"",
		["test", ["Esper: Rise up", "test"]],
		"You've never seen any place like this before...",
		"It's so... dark...",
		"However, something memory surges within you...",
		"You instinctively reach out, and...",
		"You got UMBRELLA KEYRING!",
		"You equipped UMBRELLA KEYRING!",
		"You got FADED UMBRELLA!",
		"You equipped FADED UMBRELLA!",
		"You got FADED DICE!",
		"You equipped FADED DICE!",
		"You got STRANGE KEYRING!",
		"You equipped STRANGE KEYRING!",
		"You couldn't open the door.\n\nIt's not locked, but Esper refuses to open it",
		"You hear a faint click"
	]
];

var story = [];
for(i = 0; i < 1000; i++) {
	story[i] = 0;
}

function formatText(x) {
	if(x.indexOf("\n") == -1) {
		let output = x;
		let i = LINEWIDTH;
		while(i < x.length) {
			output = output.substring(0, i + (i / LINEWIDTH * 2) - 2) + "\n" + output.substring(i + (i / LINEWIDTH * 2) - 2);
			i = i + LINEWIDTH;
		}
		return output;
	}
	return x;
}

function runChoice(x, y, n) {}

// Formats text and shows it with the in game windows
// If the parameter is an array, a choice is presented instead
function mapText(x) {
	
	console.log(script[0][0]);
	let z = script[$gameMap._mapId][x];
	
	$gameMessage.setBackground(2);
	$gameMessage.setPositionType(2);
	$gameMessage.setChoiceBackground(2);
	$gameMessage.setChoicePositionType(1);
	if(Array.isArray(z)) {
		$gameMessage.add(formatText(z[0]));
		$gameMessage.setChoices(z[1], 0);
		$gameMessage.setChoiceCallback(n => {runChoice($gameMap.mapId(), x, n);});
	} else {
		$gameMessage.add(formatText(z));
	}
	// $gameMap._interpreter.setWaitMode('message');
	console.log("done");
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