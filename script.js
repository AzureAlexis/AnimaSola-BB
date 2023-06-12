/*
	This file (script.js) contains the script of the game
	It also creates contains a few functions that make displaying text easier and more *stylish*
*/

// The whole damn script
const LINEWIDTH = 50;
var waiting;
var start;
var end;
var script = [
	[
		"test"
	],[
		["", "Esper: Rise up"],
		"You've never seen any place like this before...",
		"It's so... dark...",
		"However, a memory surges within you...",
		"You instinctively reach out, and...",
		"You got UMBRELLA KEYRING!",
		"You equipped UMBRELLA KEYRING!",
		"You got FADED UMBRELLA!",
		"You equipped FADED UMBRELLA!",
		"You got FADED DICE!",
		"You equipped FADED DICE!",
		"You got STRANGE KEYRING!",
		"You equipped STRANGE KEYRING!"
	]
];

function formatText(x) {
	let output = x;
	let i = LINEWIDTH;
	while(i < x.length) {
		output = output.substring(0, i + (i / LINEWIDTH * 2) - 2) + "\n" + output.substring(i + (i / LINEWIDTH * 2) - 2);
		i = i + LINEWIDTH;
	}
	return output;
}

function runChoice(x, y, n) {}

// Formats text and shows it with the in game windows
// If the parameter is an array, a choice is presented instead
function mapText(x) {
	waiting = true;
	console.log(script[0][0]);
	let z = script[$gameMap._mapId][x];
	
	$gameMessage.setBackground(2);
	$gameMessage.setPositionType(2);
	if(Array.isArray(z)) {
		$gameMessage.add(formatText(z[0]));
		z.splice(0, 1);
		$gameMessage.setChoices(z, 0);
		$gameMessage.setChoiceCallback(n => {runChoice($gameMap.mapId(), x, n);});
	} else {
		$gameMessage.add(formatText(z));
	}
	$gameMap._interpreter.setWaitMode('message');
	console.log("done");
}
function printText(x, y = x) {
	start = x;
	end = y;
	$gameTemp.reserveCommonEvent(4);
}