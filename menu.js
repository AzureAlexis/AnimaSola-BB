/*
	This file (menu.js) contains all the functions relating to the pause menu, including;
	-Creating and drawing the menu
	-Controller for cursor and menu animations
	-Lists containing current player items
*/
// Declare vars
var realItems = [];
var realItemQ = [];
var cursorPos = 0;
var currentFrame = 0
var counter = 0;

function intMenu() {
	$gameScreen.startTint([0, 0, 0, 255], 10);
	CallPluginCommand("createFilter menuBlur blur 21");
	$gameScreen.showPicture(1, "menuTop", 0, 0, 0, 100, 100, 255, 0);
}

function closeMenu() {
	$gameScreen.startTint([0, 0, 0, 0], 10);
	CallPluginCommand("eraseFilter menuBlur");
	for(let i = 1; i <= 6; i++) {
		$gameScreen.showPicture(i, "clear", 0, 9999, 9999, 0, 0, 0, 0);
	}
}

// Main functions
function saveRealItems() {
	realItems = [];
	realItems = $gameParty.allItems();
	for(let i = 0; i < realItems.length; i++) {
		realItemQ[i] = $gameParty.numItems($dataItems[i+1])
	}
}

function displayRealItems() {
	let itemSelect = 0;
	let itemNum = 0;
	console.log(realItems);
	console.log(realItemQ);
	for(let i = 0; i < arraySum(realItemQ); i++) {
		$gameMap.event(i+2).setDirection(Math.floor((realItems[itemSelect].id%12/3+1)*2));
		$gameMap.event(i+2).setImage("item",Math.floor(realItems[itemSelect].id/12));
		$gameMap.event(i+2)._originalPattern = realItems[itemSelect].id%3
		$gameMap.event(i+2).resetPattern();
		itemNum++;
		if(itemNum >= realItemQ[itemSelect]) {
			itemNum = 0;
			itemSelect++;
		}
	}
}	


function menuController() {
	if($gameSwitches.value(2)) {
	currentFrame++;
	if(currentFrame > 59) {
		currentFrame = 0;
	}
	let tempFrame = Math.floor(currentFrame/3)
	
	if(Input.isTriggered('down')) {
		cursorPos++;
		if(cursorPos > 3) {
			cursorPos = 0;
		}
	} else if(Input.isTriggered('up')) {
		cursorPos = cursorPos - 1;
		if(cursorPos < 0) {
			cursorPos = 3;
		}
	}
	console.log($gameSwitches.value(2));
		console.log("got frame");
		$gameScreen.showPicture(6, "cursor", 0, 88, 366 + (cursorPos * 45), 100, 100, 255, 0);
		for(let i = 0; i < 4; i++) {
			if(i != cursorPos) {
				$gameScreen.showPicture(i + 2, "menuTopOptions(1x4)", 0, 93, 360 + (i * 45), 100, 100, 255, 0);
				$gameScreen.picture(i + 2).setSpritesheetFrame(i);
			}
		}
		if(tempFrame < 10) {
			$gameScreen.showPicture(cursorPos + 2, "menuTopOptions(1x4)", 0, 122 + tempFrame, 360 + (cursorPos * 45), 100, 100, 255, 0);
		} else {
			$gameScreen.showPicture(cursorPos + 2, "menuTopOptions(1x4)", 0, 122 + 20 - tempFrame, 360 + (cursorPos * 45), 100, 100, 255, 0);
		}
		$gameScreen.picture(cursorPos + 2).setSpritesheetFrame(cursorPos);
	};
};