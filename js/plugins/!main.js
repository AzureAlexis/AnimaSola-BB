/*
	Main functions relevent to this game, mostly initilization ones
	DONT EDIT THIS UNLESS YOU KNOW WHAT YOURE DOING!!!
*/

diffReturn = function(i) {
	switch(i) {
	case 0:
		return "Easy";
	case 1:
		return "Normal";
	case 2:
		return "Hard";
	case 3:
		return "Lunatic";
	}
}

modeReturn = function(i) {
	switch(i) {
	case 0:
		return "Standard";
	case 1:
		return "Critical";
	}
}