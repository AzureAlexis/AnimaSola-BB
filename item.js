let realItems = [];
let realItemQ = [];
let cursorPos = 0;

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

function intMenu() {
	cursorPos = 0;
	$gameScreen.showPicture(1, "cursor", 0, 50, 50, 100, 100, 255, 0);
}
function menuController() {
	let x = 0;
	let y = 0;
	console.log(Input.isTriggered('right'));
	if(Input.isTriggered('right')) {
		cursorPos++;
		if(cursorPos > 3) {
			cursorPos = 0;
		}
	} else if(Input.isTriggered('left')) {
		cursorPos = cursorPos - 1;
		if(cursorPos < 0) {
			cursorPos = 3;
		}
	}
	console.log(cursorPos);
	if(cursorPos == 0) {
		x = 0;
		y = 0;
	} else if(cursorPos == 1) {
		x = 0;
		y = 4;
	} else if(cursorPos == 2) {
		x = 4;
		y = 4;
	} else {
		x = 13;
		y = 4;
	}
	console.log(cursorPos);
	$gameScreen.picture(1).move(0, x*48, y*48, 100, 100, 255, 0, 1);
};