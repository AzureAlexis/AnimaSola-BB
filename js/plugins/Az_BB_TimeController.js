Az_TimeController = function() {}
Az_TimeController.children = [];
Az_TimeController.tick = 0;

Az_TimeController.update = function() {
	let scene = SceneManager._scene;
	let timeon = $gameSwitches.value(2)
	
	if(timeon && !scene.hasTime)
		this.addSprites(scene);
	
	if(timeon && scene.hasTime)
		this.updateTime();
}

Az_TimeController.addSprites = function(scene) {
	this.children[0] = new Sprite_Base()
	this.children[0]._bitmap = ImageManager.loadBitmap("img/system/", "clock", 0, true);
	this.children[0].x = Graphics.boxWidth - 250;
	this.children[0].width = 250
	this.children[0].height = 173

	this.children[1] = new Sprite_Base(Graphics.boxWidth - 195, -24);
	this.children[1]._bitmap = ImageManager.loadBitmap("img/system/", "timeLabel", 0, true);
	this.children[1].width = 24
	this.children[1].height = 24

	this.children[2] = new Window_Base(Graphics.boxWidth - 274, 0, 300, 300);
	this.children[2].opacity = 0;

	scene.addChild(this.children[0])
	scene.addChild(this.children[1])
	scene.addChild(this.children[2])
	
	scene.hasTime = true;
	
}

Az_TimeController.updateTime = function(scene) {
	$gameVariables.setValue(6, $gameVariables.value(6) + 1)
	
	if($gameVariables.value(6) >= 360) {
		$gameVariables.setValue(6, 0);
		$gameVariables.setValue(7, $gameVariables.value(7) + 1);
	}
	if($gameVariables.value(7) >= 60) {
		$gameVariables.setValue(7, 0);
		$gameVariables.setValue(8, $gameVariables.value(8) + 1);
	}
	
	this.children[1].x = Graphics.boxWidth - 195 + $gameVariables.value(6)/360*195;
	this.children[1].y = $gameVariables.value(6)/360*195 - 24;
		
	this.children[2].contents.clear();
	
	if($gameVariables.value(7) < 10) {
		this.children[2].drawTextEx($gameVariables.value(8) + ":0" + $gameVariables.value(7), 42, 0, 500, "left");
	} else {
		this.children[2].drawTextEx($gameVariables.value(8) + ":" + $gameVariables.value(7), 42, 0, 500, "left");	
	}
	
	this.children[2].drawTextEx($gameVariables.value(10) + "/" + $gameVariables.value(9) + ", " + this.getDay(), 42, 40, 500, "left");
}

Az_TimeController.weekday = function() {
	return ($gameVariables.value(7) % 7 == 0 || $gameVariables.value(7) % 8 == 0);
}

Az_TimeController.getDay = function() {
	switch ($gameVariables.value(9) % 7) {
		case 0:
			return "Sun."
		case 1:
			return "Mon."
		case 2:
			return "Tus."
		case 3:
			return "Wed."
		case 4:
			return "Thu."
		case 5:
			return "Fri."
		case 6:
			return "Sat."
	}
	return "error"
}

Scene_Map.prototype.updateMain = function() {
    var active = this.isActive();
    $gameMap.update(active);
    $gamePlayer.update(active);
    $gameTimer.update(active);
    $gameScreen.update();
	Az_TimeController.update();
};


